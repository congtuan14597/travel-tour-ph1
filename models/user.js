"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: "user_id",
        as: "tasks"
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
