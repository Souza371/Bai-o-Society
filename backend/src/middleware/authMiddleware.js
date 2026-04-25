const { verifyToken, extractToken } = require('../utils/jwt');

/**
 * Middleware de autenticação
 * Verifica se token JWT é válido
 */

/**
 * Middleware: Autenticar requisição
 * Extrai e valida o token JWT
 */
const authenticate = (req, res, next) => {
  try {
    // Extrair token do header
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token não fornecido',
        code: 'TOKEN_OBRIGATORIO'
      });
    }

    // Validar token
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido ou expirado',
        code: 'TOKEN_INVALIDO'
      });
    }

    // Anexar dados do token ao request
    req.user = decoded;

    next();
  } catch (erro) {
    console.error('Auth Middleware Error:', erro);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao validar token',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Middleware: Requer Admin
 * Verifica se usuário é admin
 * Usar após authenticate
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.perfil !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Requer permissão de admin',
      code: 'ACESSO_NEGADO'
    });
  }
  next();
};

/**
 * Middleware: Requer Cliente
 * Verifica se usuário é cliente
 */
const requireCliente = (req, res, next) => {
  if (!req.user || req.user.perfil !== 'cliente') {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Permissão de cliente necessária',
      code: 'ACESSO_NEGADO'
    });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireCliente
};
