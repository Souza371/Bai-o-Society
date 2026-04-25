/**
 * Service: Times
 * Lógica de gestão de times
 */

class TimeService {
  /**
   * Listar times
   */
  async listar(filtros, Time, Usuario) {
    try {
      const where = filtros.ativo !== undefined ? { ativo: filtros.ativo } : {};

      const times = await Time.findAll({
        where,
        include: [
          { model: Usuario, attributes: ['id', 'nome', 'email'], as: 'capitao' }
        ],
        order: [['nome', 'ASC']]
      });

      return times;
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao listar times',
        code: 'ERRO_LISTAGEM'
      };
    }
  }

  /**
   * Buscar time por ID
   */
  async buscarPorId(id, Time, Usuario, Jogador) {
    const time = await Time.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id', 'nome', 'email'], as: 'capitao' },
        { model: Jogador, attributes: ['id', 'numero_camisa', 'posicao'] }
      ]
    });

    if (!time) {
      throw {
        status: 404,
        message: 'Time não encontrado',
        code: 'TIME_NAO_ENCONTRADO'
      };
    }

    return time;
  }

  /**
   * Criar novo time
   */
  async criar(dados, Time) {
    const { nome, descricao, capitao_id } = dados;

    if (!nome || !capitao_id) {
      throw {
        status: 400,
        message: 'Nome e capitão são obrigatórios',
        code: 'VALIDACAO_ERRO'
      };
    }

    // Verificar se nome já existe
    const timeExistente = await Time.findOne({ where: { nome } });
    if (timeExistente) {
      throw {
        status: 409,
        message: 'Time com esse nome já existe',
        code: 'NOME_EXISTE'
      };
    }

    const time = await Time.create({
      nome,
      descricao,
      capitao_id,
      ativo: true
    });

    return time;
  }

  /**
   * Atualizar time
   */
  async atualizar(id, dados, Time) {
    const time = await this.buscarPorId(id, Time);

    if (dados.nome && dados.nome !== time.nome) {
      const timeExistente = await Time.findOne({ where: { nome: dados.nome } });
      if (timeExistente) {
        throw {
          status: 409,
          message: 'Nome de time já existe',
          code: 'NOME_EXISTE'
        };
      }
    }

    return time.update(dados);
  }

  /**
   * Desativar time
   */
  async desativar(id, Time) {
    const time = await this.buscarPorId(id, Time);
    time.ativo = false;
    return time.save();
  }

  /**
   * Ativar time
   */
  async ativar(id, Time) {
    const time = await this.buscarPorId(id, Time);
    time.ativo = true;
    return time.save();
  }
}

module.exports = new TimeService();
