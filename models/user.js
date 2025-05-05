"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: "userId",
        as: "tasks",
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Customer, {
        foreignKey: "userId",
        as: "customers",
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Booking, {
        foreignKey: "userId",
        as: "bookings",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tên không được để trống"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email đã tồn tại"
      },
      validate: {
        notEmpty: {
          msg: "Email không được để trống"
        },
        isEmail: {
          msg: "Email không đúng định dạng"
        }
      }
    },
    role: {
      type: DataTypes.ENUM("1", "2"),
      allowNull: false,
      comment: "1: Employee, 2: Collaborator"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Mật khẩu không được để trống"
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dayOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true
  });

  return User;
};
