'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate(models) {
      Tour.hasMany(models.Booking, {
        foreignKey: 'tourId',
        as: 'bookings',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Tour.hasMany(models.Journey, {
        foreignKey: 'tourId',
        as: 'journeys',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Tour.hasMany(models.TourReview, {
        foreignKey: 'tourId',
        as: 'tour_reviews',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Tour.belongsToMany(models.Service, {
        through: models.TourService,
        foreignKey: 'tourId'
      });
    }
  }
  Tour.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    departure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    durationDays: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    vatIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Đã gồm VAT hay chưa',
    },
    type: {
      type: DataTypes.ENUM('1', '2', '3'),
      allowNull: true,
      defaultValue: '1',
      comment: '1: Quốc tế , 2: Nội địa, 3: Tự thiết kế',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Tour',
    tableName: "tours",
    timestamps: true,
    paranoid: true
  });

  return Tour;
};
