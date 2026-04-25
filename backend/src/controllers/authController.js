const authService = require('../services/authService');

/**
 * Controller de autenticação
 * Cuida das requisições HTTP (request/response)
 */

class AuthController {
  /**
   * POST /api/auth/register
   * Registrar novo usuário
   */
  async register(req, res) {
    try {
      const { email, senha, nome, telefone } = req.body;

      // Chamar service
      const usuario = await authService.register(
        { email, senha, nome, telefone },
        req.app.get('db').Usuario // DB passada via app
      );

      // Resposta de sucesso
      res.status(201).json({
        status: 'success',
        message: 'Usuário criado com sucesso',
        data: usuario
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * POST /api/auth/login
   * Login do usuário
   */
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Chamar service
      const resultado = await authService.login(
        email,
        senha,
        req.app.get('db').Usuario
      );

      // Resposta de sucesso
      res.status(200).json({
        status: 'success',
        message: 'Login realizado com sucesso',
        data: resultado
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Renovar token JWT
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      const resultado = await authService.refreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        data: resultado
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * Tratamento centralizado de erros
   */
  handleError(erro, res) {
    console.error('AuthController Error:', erro);

    // Se é um erro estruturado do service
    if (erro.status && erro.message) {
      return res.status(erro.status).json({
        status: 'error',
        message: erro.message,
        code: erro.code || 'ERRO_DESCONHECIDO'
      });
    }

    // Se é erro de duplicação de email (Sequelize)
    if (erro.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'error',
        message: 'Email já cadastrado',
        code: 'EMAIL_EXISTE'
      });
    }

    // Erro genérico do servidor
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor',
      code: 'SERVER_ERROR'
    });
  }
}

module.exports = new AuthController();
