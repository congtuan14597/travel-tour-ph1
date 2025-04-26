'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.belongsToMany(models.Tour, {
        through: models.TourService,
        foreignKey: 'serviceId'
      });
    }
  }
  Service.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('1','2','3','4'),
      allowNull: true,
      comment: '1: Khách sạn, 2: Nhà hàng, 3: Vận chuyển, 4: Khác',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Service',
    tableName: "services",
    timestamps: true,
    paranoid: true
  });

  return Service;
};
