const { DataTypes } = require('sequelize');

/**
 * Model: Ranking
 * Ranking de artilheiros e times
 */
module.exports = (sequelize) => {
  const Ranking = sequelize.define(
    'Ranking',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
      },
      semana: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ano: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      gols: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      assistencias: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      posicao: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Ranking',
      tableName: 'rankings',
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return Ranking;
};
