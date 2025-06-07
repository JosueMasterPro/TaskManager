import { useState, useEffect, useCallback } from 'react';
import TareaModal from '../components/TareaModal.jsx';
import { useAuth } from '../Context/authContext.js';

import '../css/C_tareas.css';

function Recordatorio( { tipo, recarga }) {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notaActiva, setNotaActiva] = useState(null);
  const { user } = useAuth()

  //variable filtrar para admins
  const [RecordatorioFiltrado, setRecordatorioFiltrado] = useState([]);

  const fetchTareas = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://personaltaskphp.up.railway.app/api/tareas',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: user.id,
          rol: user.rol,
          tipo_task: tipo,
        })
      }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al obtener tareas');
      setTareas(data);
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [user.id, user.rol, tipo]);
  
  useEffect(() => {
    fetchTareas();
  }, [recarga,fetchTareas]);

   //fitlrar para los admins
    useEffect(() => {
        setRecordatorioFiltrado(tareas.filter(t => t.id_usuario === user.id));
  }, [tareas, user.id]);


  const abrirModal = (tarea) => {
    setNotaActiva(tarea);
  };

  const cerrarModal = () => {
    setNotaActiva(null);
  };

  //Comprobar fecha para colores de las notas
  const getClassByFecha = (fechaFinal, completado) => {
    if (completado) return ''; // No cambiar color si está completada

    const hoy = new Date();
    const final = new Date(fechaFinal);

    hoy.setHours(0, 0, 0, 0);
    final.setHours(0, 0, 0, 0);

    const diferenciaEnMs = final - hoy;
    const dias = Math.ceil(diferenciaEnMs / (1000 * 60 * 60 * 24));

    if (dias < 1) return 'rojo';
    if (dias <= 4) return 'amarillo';
    return '';
  };

  return (
    <div style={{ padding: '1rem' }}>
        <h2 style={{ textAlign: 'center' }}>Mis Recordatorios</h2> 

      {loading && <p>Cargando Recordatorios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && tareas.length === 0 && <p>No hay notas para mostrar</p>}

      <div className="grid">
        {RecordatorioFiltrado.map((recordatorio) => (
          <div
            key={recordatorio.id_Tarea}
            className={`card ${getClassByFecha(recordatorio.fecha_final, recordatorio.completada)}`}
            onClick={() => abrirModal(recordatorio)}
          >
            {user.rol==="admin" && <p>{recordatorio.usuario}</p>}
            <h3 style={{ margin: '0 0 8px' }}>{recordatorio.titulo}</h3>
            <p style={{ whiteSpace: 'pre-wrap', minHeight: '50px' }}>
              {recordatorio.descripcion.length > 100
                ? recordatorio.descripcion.slice(0, 100) + '...'
                : recordatorio.descripcion}
            </p>
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Estado: {recordatorio.completada ? '✅ Completada' : '⏳ Pendiente'}
            </p>
            {recordatorio.fecha_final && (
              <p style={{ fontSize: '0.8em', color: '#888' }}>
                Fecha límite: {new Date(recordatorio.fecha_final).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {notaActiva && (
        <TareaModal
          tarea={notaActiva}
          onClose={cerrarModal}
          onSave={async () => {
            await fetchTareas();
            cerrarModal();
          }}
        />
      )}
    </div>
  );
}

export default Recordatorio;