import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Avatar from './Avatar';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/brasao.svg" alt="Baião Society" className="navbar-brasao" />
          <h1>Baião Society</h1>
        </div>
        <ul className="navbar-menu">
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          {user?.perfil === 'admin' && (
            <li>
              <a href="/admin">Administração</a>
            </li>
          )}
          <li className="navbar-user">
            <Avatar nome={user?.nome} perfil={user?.perfil} tamanho="sm" />
            <span className="user-name">{user?.nome}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
