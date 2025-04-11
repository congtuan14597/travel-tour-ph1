const moment = require("moment");
const { ValidationError } = require("sequelize");
const { User } = require("../../../models");
const bcrypt = require("bcrypt");

let getEmployees = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const whereCondition = {
      deletedAt: null,
      role: "1"
    };

    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    const error = req.query.error;

    res.render("admin/employees/index", {
      employees: rows,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      moment: moment,
      error
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let newEmployees = async (req, res) => {
  res.render("admin/employees/new");
};

let createEmployee = async (req, res) => {
  try {
    req.body.role = "1";

    if (req.body.dayOfBirth) {
      req.body.dayOfBirth = moment(
        req.body.dayOfBirth, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    await User.create(req.body);
    res.redirect("/admin/employees");
  } catch (error) {
    let errorMessage = "Lỗi khi tạo nhân viên";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          if (err.type === "unique violation" && err.path === "email") {
            return "• Email đã tồn tại";
          } else {
            return `• ${err.message}`;
          }
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(`/admin/employees?error=${encodeURIComponent(errorMessage)}`);
  }
};

let editEmployee = async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).send("Nhân viên không tồn tại");
    }

    res.render("admin/employees/edit", {formData: employee, moment});
  } catch (error) {
    console.log(error.errors)
    res.status(500).send("Internal Server Error");
  }
};

let updateEmployee = async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);

    if (req.body.dayOfBirth) {
      req.body.dayOfBirth = moment(
        req.body.dayOfBirth, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    await employee.update(req.body);

    res.redirect(`/admin/employees/edit/${employee.id}`);
  } catch (error) {
    let errorMessage = "Lỗi khi chỉnh sửa nhân viên";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          if (err.type === "unique violation" && err.path === "email") {
            return "• Email đã tồn tại";
          } else {
            return `• ${err.message}`;
          }
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(`/admin/employees?error=${encodeURIComponent(errorMessage)}`);
  }
};

let deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).send("Nhân viên không tồn tại");
    }

    await employee.destroy();

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getEmployees,
  newEmployees,
  createEmployee,
  editEmployee,
  updateEmployee,
  deleteEmployee
};
