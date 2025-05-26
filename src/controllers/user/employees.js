const moment = require("moment");
const { ValidationError } = require("sequelize");
const { User } = require("../../../models");
const bcrypt = require("bcrypt");

let editEmployee = async (req, res) => {
  try {
    const userId = req.user.id;
    const employee = await User.findByPk(userId);

    if (!employee) {
      return res.status(404).send("Nhân viên không tồn tại");
    }

    const error = req.query.error;

    res.render("user/employees/edit", { formData: employee, moment, error });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let updateEmployee = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const employee = await User.findByPk(userId);

    if (!employee) {
      return res.status(404).send("Nhân viên không tồn tại");
    }

    if (req.user.id !== userId) {
      return res.status(403).send("Không có quyền cập nhật thông tin này");
    }

    const updateData = req.body;

    if (updateData.dayOfBirth) {
      updateData.dayOfBirth = moment(
        updateData.dayOfBirth, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    if (updateData.password && updateData.password.trim() !== "") {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      updateData.password;
    }

    await employee.update(updateData);

    res.redirect("/employees/edit");
  } catch (error) {
    let errorMessage = "Lỗi khi chỉnh sửa nhân viên";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          return `• ${err.message}`;
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(`/employees/edit?error=${encodeURIComponent(errorMessage)}`);
  }
};

module.exports = {
  editEmployee,
  updateEmployee,
};
