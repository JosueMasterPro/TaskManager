import React from 'react';
import { useAuth } from '../Context/authContext';

function Navbar({ collapsed, toggle }) {
  const { user } = useAuth();

  const getInitials = () => {
    const fullName = `${user?.nombre || ''} ${user?.apellido || ''}`.trim();
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="left-section">
        <button className="toggle-btn" onClick={toggle}>
          {collapsed ? '▶' : '◀'}
        </button>
        <div className="logo">Bienvenido, {user?.usuario || 'Usuario'}</div>
      </div>
      <div className="user-info">
        <div className="user-initials">{getInitials()}</div>
        <div className="user-name">{user.nombre} {user.apellido}</div>
      </div>
    </header>
  );
}

export default Navbar;
