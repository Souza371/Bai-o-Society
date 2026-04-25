const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Faz hash da senha com bcrypt
 * @param {string} senha - Senha em plain text
 * @returns {Promise<string>} Senha com hash
 */
const hashPassword = async (senha) => {
  return bcrypt.hash(senha, SALT_ROUNDS);
};

/**
 * Compara senha com hash
 * @param {string} senha - Senha em plain text
 * @param {string} hash - Hash armazenado no BD
 * @returns {Promise<boolean>} true se as senhas batem
 */
const comparePassword = async (senha, hash) => {
  return bcrypt.compare(senha, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};
