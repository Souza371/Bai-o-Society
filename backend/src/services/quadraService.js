/**
 * Service: Quadras
 * Lógica de negócio de quadras
 */

class QuadraService {
  /**
   * Listar todas as quad ras ativas
   */
  async listar(Quadra, ativas = true) {
    try {
      const where = ativas ? { ativa: true } : {};
      const quadras = await Quadra.findAll({ where });
      return quadras;
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao listar quadras',
        code: 'ERRO_LISTAGEM'
      };
    }
  }

  /**
   * Buscar quadra por ID
   */
  async buscarPorId(Quadra, id) {
    const quadra = await Quadra.findByPk(id);
    if (!quadra) {
      throw {
        status: 404,
        message: 'Quadra não encontrada',
        code: 'QUADRA_NAO_ENCONTRADA'
      };
    }
    return quadra;
  }

  /**
   * Criar nova quadra (ADMIN)
   */
  async criar(QuadraData, Quadra) {
    const { nome, descricao, tipo, metragem, preco_hora, imagem_url } = QuadraData;

    if (!nome || preco_hora === undefined) {
      throw {
        status: 400,
        message: 'Nome e preço são obrigatórios',
        code: 'VALIDACAO_ERRO'
      };
    }

    if (preco_hora <= 0) {
      throw {
        status: 400,
        message: 'Preço deve ser maior que zero',
        code: 'VALIDACAO_ERRO'
      };
    }

    const quadra = await Quadra.create({
      nome,
      descricao,
      tipo: tipo || 'futsal',
      metragem,
      preco_hora,
      imagem_url
    });

    return quadra;
  }

  /**
   * Atualizar quadra (ADMIN)
   */
  async atualizar(id, dados, Quadra) {
    const quadra = await this.buscarPorId(Quadra, id);
    return quadra.update(dados);
  }

  /**
   * Desativar quadra (ADMIN)
   */
  async desativar(id, Quadra) {
    const quadra = await this.buscarPorId(Quadra, id);
    quadra.ativa = false;
    return quadra.save();
  }
}

module.exports = new QuadraService();
