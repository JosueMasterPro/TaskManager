import { useState, useEffect, useCallback } from 'react';
import '../css/C_tareas.css';


const TareaModal = ({ tarea, onClose, onSave, tipo, rol }) => {
  const [editTarea, setEditTarea] = useState({ ...tarea });
  const [Err,setErr] = useState("");
  const [error, setError] = useState('');

  const [Usuarios,setUsuarios] = useState([]);
  //crear tarea
  const handleCreate = async () => {
    setErr(""); // limpiar errores previos
    // Validaciones
    // Validación de campos vacíos
    if (!editTarea.titulo || !editTarea.descripcion || (rol === "admin" && !editTarea.id_usuario) || !editTarea.fecha_final) {
      setErr("Debe llenar el título, la descripción y la fecha final");
      return;
    };
    // Validación de fecha mínima
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Para comparar solo la fecha

    const fecha = new Date(editTarea.fecha_final);
    fecha.setHours(0, 0, 0, 0); // También sin tiempo

    if (fecha < hoy) {
      setErr("La fecha límite no puede ser menor a la fecha actual.");
      return;
    }

    try {
      const res = await fetch('https://personaltaskphp.up.railway.app/api/tareas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTarea),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear la tarea');
      }

      setErr("Tarea creada exitosamente");
      onSave(); // para que el componente padre refresque o cierre modal

    } catch (error) {
      setErr(error.message);
    }
  };
//llenar select con usuarios
  const fetchUsuarios = useCallback(async () => {
    
    try {
        const response = await fetch('https://personaltaskphp.up.railway.app/api/usuarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Error al obtener usuarios');
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        setError('Error al obtener usuarios:', error);
        throw error;
      }
  },[]);

  useEffect(() => {
    if(rol==="admin"){
        fetchUsuarios();
      }
  }, [tarea,fetchUsuarios,rol]);

  return (
    <div className="modalOverlay" onClick={onClose}>
    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Crear {tipo}</h3>
    <input
        type="text"
        className="modal-input"
        value={editTarea.titulo}
        onChange={(e) => setEditTarea({ ...editTarea, titulo: e.target.value })}
        placeholder="Título"
        style={{ width: "100%" }}
    />
    {rol === "admin" && 
        <select
            type="text"
            className="modal-select"
            value={editTarea.id_usuario}
            onChange={(e) => setEditTarea({ ...editTarea, id_usuario: e.target.value })}
            placeholder="Usuario"
        >
            <option value={""}>Seleccione Usuario</option>
            {Usuarios.map((user)=>(
            <option key={user.id} value={user.id}>{user.usuario}</option>
            ))}
        </select>
    }
    <textarea
        className="modal-textarea"
        value={editTarea.descripcion}
        onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 65000) {
            setEditTarea({ ...editTarea, descripcion: value });
        }
        }}
        rows={6}
        maxLength={65000}
        placeholder="Descripción"
    />

    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <label>
        <input
            type="checkbox"
            checked={editTarea.completada}
            onChange={(e) => setEditTarea({ ...editTarea, completada: e.target.checked })}
            disabled
        />{' '}
        Completada
        </label>

        <label>
        Fecha límite:
        <input
            type="date"
            value={editTarea.fecha_final || ''}
            onChange={(e) => setEditTarea({ ...editTarea, fecha_final: e.target.value })}
            style={{ marginLeft: '0.5rem' }}
        />
        </label>
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
        <button className="button editButton" onClick={handleCreate}>
        Crear {tipo}
        </button>
        <button className="button deleteButton" onClick={onClose}>
        Cancelar
        </button>
    </div>
    {Err && <p className="error-message">{Err}</p>}
    {error && <p className="error-message">{error}</p>}
    </div>
    </div>
  );
};

export default TareaModal;