import { useState } from 'react';
import { MdDelete } from 'react-icons/md';

import { useAuth } from '../Context/authContext';

import "../css/C_tareas.css"
const TareaModal = ({ tarea, onClose, onSave }) => {
  const [editTarea, setEditTarea] = useState({ ...tarea });
  const [showConfirm, setShowConfirm] = useState(false);
  
  const user = useAuth();
  //guardar el editar una tarea
  const handleGuardar = async () => {
    try {
      const res = await fetch(
        `https://personaltaskphp.up.railway.app/api/tareas/${editTarea.id_Tarea}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editTarea)
        }
      );

      if (!res.ok) throw new Error('Error al guardar');
      onSave();
    } catch (err) {
      alert(err.message);
    }
  };
  //Borrar una tarea
  const handleEliminar = async () => {
    try {
      const res = await fetch(
        `https://personaltaskphp.up.railway.app/api/tareas/delete/${editTarea.id_Tarea}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!res.ok) throw new Error('Error al eliminar la tarea');
      onSave(); // Cierra modal y refresca lista
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal__Overlay" onClick={onClose}>
      <div className="modal__Content" onClick={(e) => e.stopPropagation()}>
        <div className="input__with__button">
          <input
            type="text"
            className="modal__input"
            value={editTarea.titulo}
            onChange={(e) => setEditTarea({ ...editTarea, titulo: e.target.value })}
          />
          {/* Botón para borrar */}
            {user.rol === "admin" || editTarea.tipo === "recordatorio"?
              <button onClick={() => setShowConfirm(true)} className="close__Button" aria-label="Borrar">
                <MdDelete size={40} color="red" />
              </button>
              :
              <></>
            }
        </div>
        <textarea
          className="modal__textarea"
          value={editTarea.descripcion}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 65000) {
              setEditTarea({ ...editTarea, descripcion: value });
            }
          }}
        />

        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
          <label>
            <input
              type="checkbox"
              checked={editTarea.completada}
              onChange={(e) => setEditTarea({ ...editTarea, completada: e.target.checked })}
            />{' '}
            Completada
          </label>
          <label>
            Fecha límite:
            <input
              type="date"
              value={editTarea.fecha_final || ''}
              onChange={(e) => setEditTarea({ ...editTarea, fecha_final: e.target.value })}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="button__ edit__Button" onClick={handleGuardar}>Guardar cambios</button>
          <button className="button__ delete__Button" onClick={onClose}>Cancelar</button>
        </div>

        {/* Confirmación modal */}
        {showConfirm && (
          <div className="confirmOverlay" onClick={() => setShowConfirm(false)}>
            <div className="confirmBox" onClick={(e) => e.stopPropagation()}>
              <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="button deleteButton" onClick={handleEliminar}>Sí, eliminar</button>
                <button className="button editButton" onClick={() => setShowConfirm(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TareaModal;
