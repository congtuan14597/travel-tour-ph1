'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'users',
      });
      Booking.belongsTo(models.Tour, {
        foreignKey: 'tourId',
        as: 'tours',
      });
    }
  }
  Booking.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tourId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    numberPeople: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('1','2','3','4','5'),
      allowNull: true,
      defaultValue: '1',
      comment: '1: Chờ xác nhận, 2: Đã xác nhận, 3: Đã hủy, 4: Đã hoàn thành, 5: Thất bại',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: "bookings",
    timestamps: true,
    paranoid: true
  });

  return Booking;
};
