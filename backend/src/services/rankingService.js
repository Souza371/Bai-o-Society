/**
 * Service: Ranking
 * Lógica de leaderboards e pontuação
 */

const { Op } = require('sequelize');

class RankingService {
  /**
   * Atualizar pontuação de um jogador após partida
   */
  async registrarPartida(partida_data, Ranking, Partida, Jogador) {
    try {
      const { time_vencedor_id, time_perdedor_id, pontos_vencedor, pontos_perdedor } = partida_data;

      // Time vencedor: adiciona pontos
      await Ranking.findOrCreate({
        where: { time_id: time_vencedor_id },
        defaults: {
          time_id: time_vencedor_id,
          pontos: 0,
          vitorias: 0,
          derrotas: 0,
          empates: 0
        }
      });

      const [rankingVencedor] = await Ranking.findOrCreate({
        where: { time_id: time_vencedor_id },
        defaults: {
          time_id: time_vencedor_id,
          pontos: 0,
          vitorias: 0,
          derrotas: 0,
          empates: 0
        }
      });

      rankingVencedor.pontos += pontos_vencedor || 3;
      rankingVencedor.vitorias += 1;
      await rankingVencedor.save();

      // Time perdedor
      const [rankingPerdedor] = await Ranking.findOrCreate({
        where: { time_id: time_perdedor_id },
        defaults: {
          time_id: time_perdedor_id,
          pontos: 0,
          vitorias: 0,
          derrotas: 0,
          empates: 0
        }
      });

      rankingPerdedor.pontos += pontos_perdedor || 0;
      rankingPerdedor.derrotas += 1;
      await rankingPerdedor.save();

      return { vencedor: rankingVencedor, perdedor: rankingPerdedor };
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao registrar partida',
        code: 'ERRO_PARTIDA'
      };
    }
  }

  /**
   * Obter ranking geral (top 10)
   */
  async rankingGeral(limite = 10, Ranking, Time) {
    try {
      const ranking = await Ranking.findAll({
        include: [
          { model: Time, attributes: ['id', 'nome', 'descricao'] }
        ],
        order: [
          ['pontos', 'DESC'],
          ['vitorias', 'DESC']
        ],
        limit: limite
      });

      return ranking.map((r, idx) => ({
        posicao: idx + 1,
        time_nome: r.Time?.nome || 'Desconhecido',
        pontos: r.pontos,
        vitorias: r.vitorias,
        derrotas: r.derrotas,
        empates: r.empates,
        taxa_vitoria: r.vitorias + r.derrotas > 0
          ? ((r.vitorias / (r.vitorias + r.derrotas)) * 100).toFixed(1) + '%'
          : 'N/A'
      }));
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao buscar ranking geral',
        code: 'ERRO_RANKING'
      };
    }
  }

  /**
   * Ranking mensal (últimos 30 dias)
   */
  async rankingMensal(Ranking, Partida, Time) {
    try {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 30);

      const rankings = await Ranking.findAll({
        include: [
          {
            model: Time,
            attributes: ['id', 'nome'],
            include: [
              {
                model: Partida,
                attributes: [],
                where: {
                  data: { [Op.gte]: dataLimite }
                }
              }
            ]
          }
        ],
        order: [['pontos', 'DESC']],
        limit: 10
      });

      return rankings.map((r, idx) => ({
        posicao: idx + 1,
        time: r.Time?.nome || 'Desconhecido',
        pontos: r.pontos,
        vitorias: r.vitorias,
        derrotas: r.derrotas
      }));
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao buscar ranking mensal',
        code: 'ERRO_RANKING_MENSAL'
      };
    }
  }

  /**
   * Ranking por pontuação média (desempenho)
   */
  async rankingPorDesempenho(Ranking) {
    try {
      const rankings = await Ranking.findAll({
        attributes: {
          include: [
            [
              Ranking.sequelize.literal(
                `ROUND(pontos::numeric / NULLIF(vitorias + derrotas, 0), 2)`
              ),
              'pontos_por_jogo'
            ]
          ]
        },
        order: [[Ranking.sequelize.literal('pontos_por_jogo'), 'DESC']],
        limit: 10,
        subQuery: false,
        raw: true
      });

      return rankings.map((r, idx) => ({
        posicao: idx + 1,
        pontos_totais: r.pontos,
        jogos: r.vitorias + r.derrotas,
        pontos_por_jogo: parseFloat(r.pontos_por_jogo) || 0
      }));
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao calcular desempenho',
        code: 'ERRO_DESEMPENHO'
      };
    }
  }

  /**
   * Ranking de uma categoria específica
   */
  async buscarPorTime(time_id, Ranking) {
    const ranking = await Ranking.findOne({
      where: { time_id }
    });

    if (!ranking) {
      throw {
        status: 404,
        message: 'Time sem ranking',
        code: 'RANKING_NAO_ENCONTRADO'
      };
    }

    return ranking;
  }

  /**
   * Reset de ranking (admin only)
   */
  async resetarRanking(Ranking) {
    try {
      await Ranking.update(
        { pontos: 0, vitorias: 0, derrotas: 0, empates: 0 },
        { where: {} }
      );

      return { message: 'Ranking resetado com sucesso' };
    } catch (erro) {
      throw {
        status: 500,
        message: 'Erro ao resetar ranking',
        code: 'ERRO_RESET'
      };
    }
  }
}

module.exports = new RankingService();
