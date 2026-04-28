import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Avatar from './Avatar';
import { authService } from '../services';
import './Navbar.css';

function Navbar() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = async () => {
      const fotoUrl = typeof leitor.result === 'string' ? leitor.result : '';
      if (!fotoUrl) return;

      setUpdatingPhoto(true);
      try {
        const response = await authService.atualizarPerfil({ avatar_url: fotoUrl });
        updateUser(response.data.data);
      } catch (error) {
        alert('Erro ao atualizar foto de perfil');
      } finally {
        setUpdatingPhoto(false);
        event.target.value = '';
      }
    };
    leitor.readAsDataURL(arquivo);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/brasao-oficial.jpg" alt="Baião Society Logo" className="navbar-brasao" />
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="avatar-file-input"
              onChange={handlePhotoChange}
            />
            <Avatar
              nome={user?.nome}
              perfil={user?.perfil}
              fotoUrl={user?.avatar_url}
              tamanho="sm"
              onClick={handleAvatarClick}
              editable
            />
            <span className="user-name">{user?.nome}</span>
            <button className="logout-btn" onClick={handleLogout}>
              {updatingPhoto ? 'Salvando...' : 'Sair'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
