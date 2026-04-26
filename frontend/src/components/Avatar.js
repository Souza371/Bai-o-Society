import React from 'react';
import './Avatar.css';

function Avatar({ nome, email, perfil, tamanho = 'md' }) {
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
    <div className={`avatar avatar-${tamanho}`} style={{ backgroundColor: getCorPerfil() }}>
      <img src="/brasao.svg" alt={`Avatar de ${nome}`} className="avatar-brasao" />
      <div className="avatar-initials">{iniciais}</div>
    </div>
  );
}

export default Avatar;
