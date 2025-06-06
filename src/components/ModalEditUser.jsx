import { useState } from 'react';
import { MdDelete } from 'react-icons/md';

import '../css/ModalEditarUser.css';

const ModalEditUser = ({ usuario, onClose, onSave }) => {
    const [editUser, seteditUser] = useState({ ...usuario });
    const [showConfirm, setShowConfirm] = useState(false);
    const [err, seterr] = useState(false);

    const handleGuardar = async (e) => {
        e.preventDefault();
     try {
        const res = await fetch(
            `https://personaltaskphp.up.railway.app/api/usuarios`,
            {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editUser)
            }
        );

        if (!res.ok) throw new Error(DataTransfer.message || 'Error al guardar');
        onSave();
        } catch (err) {
        alert(err.message);
        }
    };

    const handleEliminar = async (e) => {
      e.preventDefault();
      if(editUser.activo === 0){
        seterr("Usuario ya esta desactivado");
        setShowConfirm(false);
      }
      else{
        try {
          const res = await fetch(
              `https://personaltaskphp.up.railway.app/api/edit/usuarios`,
              {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({id: editUser.id})
              }
          );

          if (!res.ok) throw new Error(DataTransfer.message || 'Error al guardar');
          onSave();
          } catch (err) {
            seterr(err.message);
          }
      }
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
          <input name="usuario" value={editUser.usuario} onChange={(e) => seteditUser({ ...editUser, titulo: e.target.value })} disabled/>

          <label>Nombre</label>
          <input name="nombre" value={editUser.nombre} onChange={(e) => seteditUser({ ...editUser, nombre: e.target.value })} required />

          <label>Apellido</label>
          <input name="apellido" value={editUser.apellido} onChange={(e) => seteditUser({ ...editUser, apellido: e.target.value })} required />

          <label>Email</label>
          <input type="email" name="email" value={editUser.email} onChange={(e) => seteditUser({ ...editUser, email: e.target.value })} required />
            <label>Roles</label>
            <select
                value={editUser.rol}
                onChange={(e) => seteditUser({ ...editUser, rol: e.target.value })}
                className="filtro-select estilizado"
                >
                <option value="">Escoger rol</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
            </select>
            {usuario.activo?
              <></>
              :
              <div className='div-check'>
                <label className='label-div-check'>
                  <input
                    type="checkbox"
                    checked={editUser.activo}
                    onChange={(e) => seteditUser({ ...editUser, activo: e.target.checked })}
                  />{' '} Activar
                </label>
              </div> 
            }
            
            {err && <p className="error-message">{err}</p>}
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
