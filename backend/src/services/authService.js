const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

/**
 * Service de autenticação
 * Contém toda lógica de negócio (register, login)
 */

class AuthService {
  /**
   * Registrar novo usuário
   * @param {Object} userData - {email, senha, nome, telefone}
   * @param {Object} Usuario - Model do Sequelize
   * @returns {Promise<Object>} Usuário criado (sem senha)
   */
  async register(userData, Usuario) {
    const { email, senha, nome, telefone } = userData;

    // Validar campos obrigatórios
    if (!email || !senha || !nome) {
      throw {
        status: 400,
        message: 'Email, senha e nome são obrigatórios',
        code: 'VALIDACAO_ERRO'
      };
    }

    // Validar email
    if (!this.isValidEmail(email)) {
      throw {
        status: 400,
        message: 'Email inválido',
        code: 'EMAIL_INVALIDO'
      };
    }

    // Validar força da senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      throw {
        status: 400,
        message: 'Senha deve ter no mínimo 6 caracteres',
        code: 'SENHA_FRACA'
      };
    }

    // Verificar se email já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      throw {
        status: 409,
        message: 'Email já cadastrado',
        code: 'EMAIL_EXISTE'
      };
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha);

    // Criar usuário
    const usuario = await Usuario.create({
      email,
      senha_hash: senhaHash,
      nome,
      telefone: telefone || null,
      perfil: 'cliente' // Por padrão, novo usuário é cliente
    });

    // Retornar sem a senha
    return this.sanitizeUser(usuario);
  }

  /**
   * Login do usuário
   * @param {string} email
   * @param {string} senha
   * @param {Object} Usuario - Model do Sequelize
   * @returns {Promise<Object>} {token, refreshToken, user}
   */
  async login(email, senha, Usuario) {
    // Validar campos
    if (!email || !senha) {
      throw {
        status: 400,
        message: 'Email e senha são obrigatórios',
        code: 'VALIDACAO_ERRO'
      };
    }

    // Buscar usuário
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      throw {
        status: 401,
        message: 'Credenciais inválidas',
        code: 'CREDENCIAIS_INVALIDAS'
      };
    }

    // Verificar senha
    const senhaCorreta = await comparePassword(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      throw {
        status: 401,
        message: 'Credenciais inválidas',
        code: 'CREDENCIAIS_INVALIDAS'
      };
    }

    // Gerar tokens
    const payload = {
      userId: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil
    };

    const token = generateToken(
      payload,
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRY || '7d'
    );

    const refreshToken = generateToken(
      payload,
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRY || '30d'
    );

    return {
      token,
      refreshToken,
      user: this.sanitizeUser(usuario),
      expiresIn: 604800 // 7 dias em segundos
    };
  }

  /**
   * Refresh do token JWT
   * @param {string} refreshToken
   * @returns {Object} {token, expiresIn}
   */
  async refreshToken(refreshToken) {
    const { verifyToken } = require('../utils/jwt');

    if (!refreshToken) {
      throw {
        status: 400,
        message: 'Refresh token é obrigatório',
        code: 'TOKEN_OBRIGATORIO'
      };
    }

    const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!payload) {
      throw {
        status: 401,
        message: 'Refresh token inválido',
        code: 'TOKEN_INVALIDO'
      };
    }

    const newToken = generateToken(
      {
        userId: payload.userId,
        email: payload.email,
        perfil: payload.perfil
      },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRY || '7d'
    );

    return {
      token: newToken,
      expiresIn: 604800
    };
  }

  /**
   * Valida formato de email
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Remove campos sensíveis do usuário
   * @param {Object} usuario - Instância do Sequelize
   * @returns {Object} Usuário sem dados sensíveis
   */
  sanitizeUser(usuario) {
    const { id, email, nome, telefone, perfil, createdAt } = usuario;
    return { id, email, nome, telefone, perfil, createdAt };
  }
}

module.exports = new AuthService();
