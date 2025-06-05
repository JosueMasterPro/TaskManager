import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

import Navbar from '../components/Navbar';
import Sidebar from '../components/SideBar';
import Tareas from '../components/Tareas';
import Recordatorios from '../components/Recordatorios';
import TareaModalCreate from '../components/CreateTaskModal.jsx';

import { useAuth } from '../Context/authContext';

function Main() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedView, setSelectedView] = useState('Tarea');
  const [notaActiva, setNotaActiva] = useState(null);
  const [reloadTareas, setReloadTareas] = useState(false);
  const [reloadRecordatorio, setRecordatorio] = useState(false);
  const { user, logout } = useAuth();
  const [tareaBlanco,settaraBlanco] = useState(null);
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
      // Si la pantalla es menor o igual a 768px (móvil), que esté colapsado
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }, []);

  const abrirModal = (tarea) => {
    setNotaActiva(tarea);
  };

  const cerrarModal = () => {
    setNotaActiva(null);
  };

  useEffect(()=>{
    settaraBlanco({
      id_usuario: user.id,
      titulo: "",
      tipo: selectedView.toLocaleLowerCase(),
      descripcion: "",
      completada: 0,
      fecha_final: "",
    });
  },[selectedView]);

  return (
    <div className="layout">
      <Navbar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
      <div className="content-body">
        <Sidebar 
            collapsed={collapsed}
            onSelect={setSelectedView}
            selected={selectedView}
            logout={handleLogout}/>
        <main className="content">
          {/* Mostrar componente según la selección */}
          {selectedView === 'Tarea' && <Tareas tipo="tarea" recarga={reloadTareas} />}
          {selectedView === 'Recordatorio' && <Recordatorios tipo="recordatorio" recarga={reloadRecordatorio} />}
            {/* Botón flotante según rol y vista */}
            {(
              (selectedView === 'Tarea' && user?.rol === 'admin') ||
              selectedView === 'Recordatorio'
            ) && (
              <button className="floating-add-btn" onClick={() => {abrirModal(tareaBlanco)}}>
                <FiPlus size={40}/>
              </button>
            )}
        </main>
      </div>
       {notaActiva && (
        <TareaModalCreate
          tarea={notaActiva}
          onClose={cerrarModal}
          tipo={selectedView}
          rol={user.rol}
          onSave={async () => {
            cerrarModal();
            setReloadTareas(prev => !prev);
            setRecordatorio(prev => !prev);
          }}
        />
      )}
    </div>
  );
}

export default Main;
