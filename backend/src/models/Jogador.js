const { DataTypes } = require('sequelize');

/**
 * Model: Jogador
 * Jogadores dos times
 */
module.exports = (sequelize) => {
  const Jogador = sequelize.define(
    'Jogador',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      time_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'times', key: 'id' }
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' }
      },
      numero_camisa: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      posicao: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Jogador',
      tableName: 'jogadores',
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return Jogador;
};
