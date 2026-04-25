const { DataTypes } = require('sequelize');

/**
 * Model: Usuario
 * Representa usuários do sistema (admin / cliente)
 */
module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      senha_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      telefone: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      perfil: {
        type: DataTypes.ENUM('admin', 'cliente'),
        defaultValue: 'cliente',
        allowNull: false
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
      underscored: true, // Usar snake_case no BD
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  );

  return Usuario;
};
