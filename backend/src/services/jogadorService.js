/**
 * Service: Jogadores
 * Lógica de gestão de jogadores em times
 */

class JogadorService {
  /**
   * Listar jogadores de um time
   */
  async listarPorTime(time_id, Jogador, Usuario, Time) {
    try {
      // Verificar se time existe
      const time = await Time.findByPk(time_id);
      if (!time) {
        throw {
          status: 404,
          message: 'Time não encontrado',
          code: 'TIME_NAO_ENCONTRADO'
        };
      }

      const jogadores = await Jogador.findAll({
        where: { time_id, ativo: true },
        include: [
          { model: Usuario, attributes: ['id', 'nome', 'email'] }
        ],
        order: [['numero_camisa', 'ASC']]
      });

      return jogadores;
    } catch (erro) {
      if (erro.status) throw erro;
      throw {
        status: 500,
        message: 'Erro ao listar jogadores',
        code: 'ERRO_LISTAGEM'
      };
    }
  }

  /**
   * Buscar jogador por ID
   */
  async buscarPorId(id, Jogador, Usuario) {
    const jogador = await Jogador.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id', 'nome', 'email'] }
      ]
    });

    if (!jogador) {
      throw {
        status: 404,
        message: 'Jogador não encontrado',
        code: 'JOGADOR_NAO_ENCONTRADO'
      };
    }

    return jogador;
  }

  /**
   * Adicionar jogador ao time
   */
  async adicionar(dados, Jogador, Usuario, Time) {
    const { time_id, usuario_id, numero_camisa, posicao } = dados;

    if (!time_id || !usuario_id) {
      throw {
        status: 400,
        message: 'Time e usuário são obrigatórios',
        code: 'VALIDACAO_ERRO'
      };
    }

    // Verificar se time existe
    const time = await Time.findByPk(time_id);
    if (!time) {
      throw {
        status: 404,
        message: 'Time não encontrado',
        code: 'TIME_NAO_ENCONTRADO'
      };
    }

    // Verificar se usuário existe
    const usuario = await Usuario.findByPk(usuario_id);
    if (!usuario) {
      throw {
        status: 404,
        message: 'Usuário não encontrado',
        code: 'USUARIO_NAO_ENCONTRADO'
      };
    }

    // Verificar se já é jogador do time
    const jogadorExistente = await Jogador.findOne({
      where: { time_id, usuario_id }
    });

    if (jogadorExistente) {
      throw {
        status: 409,
        message: 'Usuário já é jogador do time',
        code: 'JOGADOR_EXISTE'
      };
    }

    const jogador = await Jogador.create({
      time_id,
      usuario_id,
      numero_camisa: numero_camisa || null,
      posicao: posicao || null,
      ativo: true
    });

    return jogador;
  }

  /**
   * Atualizar jogador
   */
  async atualizar(id, dados, Jogador) {
    const jogador = await this.buscarPorId(id, Jogador);
    return jogador.update(dados);
  }

  /**
   * Remover jogador do time
   */
  async remover(id, Jogador) {
    const jogador = await this.buscarPorId(id, Jogador);
    jogador.ativo = false;
    return jogador.save();
  }
}

module.exports = new JogadorService();
