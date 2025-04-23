'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }
  Customer.init({
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dayOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Nam", "Nữ", "Khác"),
      allowNull: false,
    },
    national: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    village: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    createdAtCard: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    commune: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provinceCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    districtCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    communeCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
    paranoid: true
  });
  return Customer;
};
