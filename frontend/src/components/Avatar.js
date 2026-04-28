import React from 'react';
import './Avatar.css';

function Avatar({ nome, email, perfil, fotoUrl, tamanho = 'md', onClick, editable = false }) {
  // Extrair iniciais do nome
  const iniciais = nome
    ? nome
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'US';

  // Cor baseada no perfil
  const getCorPerfil = () => {
    switch (perfil) {
      case 'admin':
        return '#e74c3c'; // Vermelho
      case 'cliente':
        return '#3498db'; // Azul
      default:
        return '#95a5a6'; // Cinza
    }
  };

  return (
    <div
      className={`avatar avatar-${tamanho} ${editable ? 'avatar-editable' : ''}`}
      style={{ backgroundColor: getCorPerfil() }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {fotoUrl ? (
        <img src={fotoUrl} alt={`Avatar de ${nome}`} className="avatar-photo" />
      ) : (
        <>
          <img src="/brasao-oficial.jpg" alt={`Avatar de ${nome}`} className="avatar-brasao" />
          <div className="avatar-initials">{iniciais}</div>
        </>
      )}
      {editable && <span className="avatar-edit-badge">Editar</span>}
    </div>
  );
}

export default Avatar;
