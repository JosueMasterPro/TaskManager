
import { FaTasks, FaBell, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../Context/authContext';
import "../css/SideBar.css"

function Sidebar({ collapsed, onSelect, selected, logout }) {
  const { user } = useAuth();
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav>
        <ul>
          <li
            className={selected === 'Tarea' ? 'active' : ''}
            onClick={() => onSelect('Tarea')}
          >
            <FaTasks className="sidebar-icon" />
            {!collapsed && <span className="sidebar-text">Tareas</span>}
          </li>
          <li
            className={selected === 'Recordatorio' ? 'active' : ''}
            onClick={() => onSelect('Recordatorio')}
          >
            <FaBell className="sidebar-icon" />
            {!collapsed && <span className="sidebar-text">Recordatorios</span>}
          </li>
          {user.rol === "admin" && 
            <li
              className={selected === 'usuario' ? 'active' : ''}
              onClick={() => onSelect('usuario')}
            >
              <FaUser size={24} className="sidebar-icon" />
              {!collapsed && <span className="sidebar-text">Usuarios</span>}
            </li>
          }
        </ul>
      </nav>

      <button className="logout-btn-sidebar" onClick={logout}>
        <FaSignOutAlt className="sidebar-icon" />
        {!collapsed && <span className="sidebar-text">Cerrar sesión</span>}
      </button>
    </aside>
  );
}

export default Sidebar;
