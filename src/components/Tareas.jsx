import { useState, useEffect, useCallback } from 'react';
import TareaModal from '../components/TareaModal.jsx';
import { useAuth } from '../Context/authContext.js';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi'; // HeroIcons

import '../css/C_tareas.css';

function TareasNotas( {tipo, recarga } ) {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notaActiva, setNotaActiva] = useState(null);
  
  const { user } = useAuth()

  //variable filtrar
  const [verTodas, setVerTodas] = useState(false);
  const [tareasFiltradas, setTareasFiltradas] = useState([]);

  const fetchTareas = useCallback( async () => {
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
  },[user.id, user.rol, tipo]);
  //recargar tareas
  useEffect(() => {
      fetchTareas();
    }, [recarga, fetchTareas]);
    
    //fitlrar
    useEffect(() => {
    if (verTodas) {
      setTareasFiltradas(tareas); // 0 filtro
    } else {
        setTareasFiltradas(tareas.filter(t => t.id_usuario === user.id));
    }
  }, [tareas, user.id, verTodas]);


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
      {user.rol === "admin"? 
        <h2 onClick={()=>{setVerTodas(prev => !prev)}} className='titulo-hover'><p>
          {verTodas ? <> Todas las notas <HiArrowLeft size={24}/>  </> : <> Mis Notas <HiArrowRight size={24}/> </>}
          </p></h2> 
        : 
        <h2 style={{ textAlign: 'center' }}>Mis Notas</h2>}

      {loading && <p>Cargando tareas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && tareas.length === 0 && <p>No hay notas para mostrar</p>}

      <div className="grid">
        {tareasFiltradas.map((tarea) => (
          <div
            key={tarea.id_Tarea}
            className={`card ${getClassByFecha(tarea.fecha_final, tarea.completada)}`}
            onClick={() => abrirModal(tarea)}
          >
            {user.rol==="admin" && <p>{tarea.usuario}</p>}
            <h3 style={{ margin: '0 0 8px' }}>{tarea.titulo}</h3>
            <p style={{ whiteSpace: 'pre-wrap', minHeight: '50px' }}>
              {tarea.descripcion.length > 100
                ? tarea.descripcion.slice(0, 100) + '...'
                : tarea.descripcion}
            </p>
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              Estado: {tarea.completada ? '✅ Completada' : '⏳ Pendiente'}
            </p>
            {tarea.fecha_final && (
              <p style={{ fontSize: '0.8em', color: '#888' }}>
                Fecha límite: {new Date(tarea.fecha_final).toLocaleDateString()}
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

export default TareasNotas;
