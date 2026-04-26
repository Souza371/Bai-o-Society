const reservaService = require('../services/reservaService');
const validacaoHorarios = require('../services/validacaoHorarios');

/**
 * Controller: Reserva
 * Endpoints HTTP de reservas
 * CORE DO SISTEMA
 */

class ReservaController {
  /**
   * POST /api/reservas - Criar nova reserva
   */
  async criar(req, res) {
    try {
      const usuario_id = req.user.userId;
      const dados = { ...req.body, usuario_id };

      const reserva = await reservaService.criar(
        dados,
        req.app.get('sequelize'),
        req.app.get('db').Reserva,
        req.app.get('db').Quadra,
        req.app.get('db').Pagamento,
        req.app.get('db').Usuario
      );

      res.status(201).json({
        status: 'success',
        message: 'Reserva criada com sucesso',
        data: reserva
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/reservas - Listar reservas (com filtros)
   */
  async listar(req, res) {
    try {
      const { quadra_id, data, status, usuario_id } = req.query;
      const usuario_id_filtro = usuario_id || (req.user.perfil === 'cliente' ? req.user.userId : null);

      const filtros = {};
      if (quadra_id) filtros.quadra_id = quadra_id;
      if (data) filtros.data = data;
      if (status) filtros.status = status;
      if (usuario_id_filtro && req.user.perfil === 'cliente') {
        filtros.usuario_id = usuario_id_filtro;
      } else if (usuario_id) {
        filtros.usuario_id = usuario_id;
      }

      const reservas = await reservaService.listar(
        filtros,
        req.app.get('db').Reserva,
        req.app.get('db').Usuario,
        req.app.get('db').Quadra
      );

      res.json({
        status: 'success',
        data: reservas
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/reservas/horarios-livres/?quadra_id=1&data=2026-04-25
   * Retorna horários disponíveis de uma quadra
   */
  async horariosLivres(req, res) {
    try {
      const { quadra_id, data } = req.query;

      if (!quadra_id || !data) {
        return res.status(400).json({
          status: 'error',
          message: 'quadra_id e data são obrigatórios',
          code: 'VALIDACAO_ERRO'
        });
      }

      const horarios = await validacaoHorarios.getHorarioLivres(
        req.app.get('sequelize'),
        req.app.get('db').Reserva,
        quadra_id,
        data
      );

      res.json({
        status: 'success',
        data: horarios
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/reservas/:id - Buscar reserva por ID
   */
  async buscar(req, res) {
    try {
      const { id } = req.params;
      const reserva = await reservaService.buscarPorId(
        id,
        req.app.get('db').Reserva,
        req.app.get('db').Usuario,
        req.app.get('db').Quadra
      );

      res.json({
        status: 'success',
        data: reserva
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PUT /api/reservas/:id - Atualizar reserva
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const reserva = await reservaService.atualizar(
        id,
        req.body,
        req.app.get('sequelize'),
        req.app.get('db').Reserva,
        req.app.get('db').Quadra
      );

      res.json({
        status: 'success',
        message: 'Reserva atualizada com sucesso',
        data: reserva
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * DELETE /api/reservas/:id - Cancelar reserva
   */
  async cancelar(req, res) {
    try {
      const { id } = req.params;
      const reserva = await reservaService.cancelar(id, req.app.get('db').Reserva);

      res.json({
        status: 'success',
        message: 'Reserva cancelada com sucesso',
        data: reserva
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * PATCH /api/reservas/:id/confirmar - Confirmar reserva (ADMIN)
   */
  async confirmar(req, res) {
    try {
      const { id } = req.params;
      const reserva = await reservaService.confirmar(id, req.app.get('db').Reserva);

      res.json({
        status: 'success',
        message: 'Reserva confirmada com sucesso',
        data: reserva
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  /**
   * GET /api/reservas/calendario/disponibilidades - Obter calendário com disponibilidades
   */
  async obterCalendario(req, res) {
    try {
      const { mes, ano } = req.query;
      
      if (!mes || !ano) {
        return res.status(400).json({
          status: 'error',
          message: 'Mês e ano são obrigatórios',
          code: 'PARAMETROS_INVALIDOS'
        });
      }

      const calendario = await reservaService.buscarDisponibilidades(
        parseInt(mes),
        parseInt(ano),
        req.app.get('db').Reserva
      );

      res.json({
        status: 'success',
        message: 'Calendário obtido com sucesso',
        data: calendario
      });
    } catch (erro) {
      this.handleError(erro, res);
    }
  }

  handleError(erro, res) {
    console.error('ReservaController Error:', erro);

    if (erro.status && erro.message) {
      return res.status(erro.status).json({
        status: 'error',
        message: erro.message,
        code: erro.code
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor',
      code: 'SERVER_ERROR'
    });
  }
}

module.exports = new ReservaController();
