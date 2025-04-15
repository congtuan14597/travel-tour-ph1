"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Task.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nhân viên không được để trống"
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tiêu đề không được để trống"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nội dung không được để trống"
        }
      }
    },
    status: {
      type: DataTypes.ENUM("1", "2", "3", "4"),
      allowNull: false,
      comment: "1: Open, 2: In progress, 3: Done, 4: Pending",
      validate: {
        notEmpty: {
          msg: "Trạng thái không được để trống"
        }
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Ngày bắt đầu không được để trống"
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Ngày kết thúc không được để trống"
        }
      }
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: true,
    paranoid: true
  });

  return Task;
};
