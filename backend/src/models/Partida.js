const { DataTypes } = require('sequelize');

/**
 * Model: Partida
 * Partidas entre times
 */
module.exports = (sequelize) => {
  const Partida = sequelize.define(
    'Partida',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      time_a_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'times', key: 'id' }
      },
      time_b_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'times', key: 'id' }
      },
      quadra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'quadras', key: 'id' }
      },
      data: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
      },
      resultado: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      gols_time_a: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      gols_time_b: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      status: {
        type: DataTypes.ENUM('agendada', 'realizada', 'cancelada'),
        defaultValue: 'agendada'
      }
    },
    {
      sequelize,
      modelName: 'Partida',
      tableName: 'partidas',
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return Partida;
};
