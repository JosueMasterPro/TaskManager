
import { FaTasks, FaBell, FaSignOutAlt } from 'react-icons/fa';

function Sidebar({ collapsed, onSelect, selected, logout }) {
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
