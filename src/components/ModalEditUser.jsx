import { useState } from 'react';
import { MdDelete } from 'react-icons/md';

import '../css/ModalEditarUser.css';

const ModalEditUser = ({ usuario, onClose, onSave }) => {
    const [editTarea, setEditTarea] = useState({ ...usuario });
    const [showConfirm, setShowConfirm] = useState(false);

    const handleGuardar = async (e) => {
        e.preventDefault();
     try {
        const res = await fetch(
            `https://personaltaskphp.up.railway.app/api/usuarios`,
            {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editTarea)
            }
        );

        if (!res.ok) throw new Error(DataTransfer.message || 'Error al guardar');
        onSave();
        } catch (err) {
        alert(err.message);
        }
    };

    const handleEliminar = async () => {
        /*try {
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
        }*/
    };
  return (
    <div className="modalOverlay">
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        {/* Botón para abrir confirmación de eliminar */}
        <button onClick={() => setShowConfirm(true)} className="closeButton" aria-label="Borrar">
          <MdDelete size={40} color="red" />
        </button>

        <h3>Editar Usuario</h3>
        <form onSubmit={handleGuardar} className="modal-form">
          <label>Usuario</label>
          <input name="usuario" value={editTarea.usuario} onChange={(e) => setEditTarea({ ...editTarea, titulo: e.target.value })} disabled/>

          <label>Nombre</label>
          <input name="nombre" value={editTarea.nombre} onChange={(e) => setEditTarea({ ...editTarea, nombre: e.target.value })} required />

          <label>Apellido</label>
          <input name="apellido" value={editTarea.apellido} onChange={(e) => setEditTarea({ ...editTarea, apellido: e.target.value })} required />

          <label>Email</label>
          <input type="email" name="email" value={editTarea.email} onChange={(e) => setEditTarea({ ...editTarea, email: e.target.value })} required />
            <label>Roles</label>
            <select
                value={editTarea.rol}
                onChange={(e) => setEditTarea({ ...editTarea, rol: e.target.value })}
                className="filtro-select estilizado"
                >
                <option value="">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
            </select>
          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>

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

export default ModalEditUser;
