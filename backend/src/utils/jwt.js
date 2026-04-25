const jwt = require('jsonwebtoken');

/**
 * Gera token JWT
 * @param {Object} payload - Dados do token (ex: {userId: 1, perfil: 'admin'})
 * @param {string} secret - Chave secreta
 * @param {string} expiresIn - Tempo de expiração (ex: '7d')
 * @returns {string} Token JWT
 */
const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifica e decodifica token JWT
 * @param {string} token - Token a validar
 * @param {string} secret - Chave secreta
 * @returns {Object} Payload do token ou null se inválido
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

/**
 * Extrai token do header Authorization
 * @param {string} authHeader - Header Authorization (ex: "Bearer eyJh...")
 * @returns {string} Token sem "Bearer " ou null
 */
const extractToken = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};
