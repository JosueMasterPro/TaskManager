import { useState, useEffect, useCallback } from 'react';
import { FaUser, FaEdit } from 'react-icons/fa';
import ModalEditUser from '../components/ModalEditUser.jsx';

import '../css/TablaUsuarios.css';

function UsuarioCrud() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notaActiva, setNotaActiva] = useState(null);
  const [filtro, setFiltro] = useState("");

  const [Usuarios,setUsuarios] = useState([]);
  const [usuariosFiltrados,setusuariosFiltrados] = useState([]);
  const [rolFiltro, setRolFiltro] = useState('');


  //Traer Usuarios
  const fetchUsuarios = useCallback(async () => {
    
    try {
        const response = await fetch('https://personaltaskphp.up.railway.app/api/usuarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setLoading(true);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Error al obtener usuarios');
        }

        const data = await response.json();
        setUsuarios(data);
        setLoading(false);
      } catch (error) {
        setError('Error al obtener usuarios:', error);
        throw error;
      }
  },[]);

  useEffect(() => {
        fetchUsuarios();
  }, [fetchUsuarios]);

  const abrirModal = (datos) => {
    setNotaActiva(datos);
  };

  const cerrarModal = () => {
    setNotaActiva(null);
  };

    //fitlrar
  useEffect(() => {
    const valor = filtro.toLowerCase();

    const filtrados = Usuarios.filter((u) => {
      const coincideTexto =
        (u.usuario?.toLowerCase() || '').includes(valor) ||
        (u.nombre?.toLowerCase() || '').includes(valor);
      const coincideRol = rolFiltro === '' || u.rol === rolFiltro;
      return coincideTexto && coincideRol;
    });

    setusuariosFiltrados(filtrados);
  }, [filtro, rolFiltro, Usuarios]);


  return (
    <div style={{ padding: '1rem' }}> 
      {loading && <p>Cargando Usuarios...</p>}
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      {!loading && Usuarios.length === 0 && <p>No hay notas para mostrar</p>}

      <div className="tabla-header">
        <FaUser size={24} style={{ marginRight: '8px', color: '#007bff' }} />
        <h2>Lista de Usuarios</h2>
      </div>

      <div className="filtros-contenedor">
        <input
          type="text"
          placeholder="Filtrar por usuario"
          name='Filtro'
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-input estilizado"
        />

        <select
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
          className="filtro-select estilizado"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <table className="tabla-usuarios" style={{overflowx: "auto"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Verificado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
             <tr key={u.id} className={u.activo === 1 ? "Verde" : "Rojo"}>
              <td data-label="ID">{u.id}</td>
              <td data-label="Usuario">{u.usuario}</td>
              <td data-label="Nombre">{u.nombre}</td>
              <td data-label="Apellido">{u.apellido}</td>
              <td data-label="Email">{u.email}</td>
              <td data-label="Rol">{u.rol}</td>
              <td data-label="Verificado" style={{textAlign : "center"}}>{u.verificado? '✅' : '⏳'}</td>
              <td data-label="Acciones"> <FaEdit className='icono-editar' size={24} onClick={() => {abrirModal(u)}}/></td>
            </tr>
          ))}
        </tbody>
      </table>
      {notaActiva && (
        <ModalEditUser
          usuario={notaActiva}
          onClose={cerrarModal}
          onSave={async () => {
            await fetchUsuarios();
            cerrarModal();
          }}
        />
      )}
    </div>
  );
}

export default UsuarioCrud;
