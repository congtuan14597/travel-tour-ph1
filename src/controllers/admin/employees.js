const moment = require("moment");
const { ValidationError } = require("sequelize");
const { User, Task } = require("../../../models");
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

    res.render("admin/employees/index", {
      employees: rows,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      moment: moment
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let newEmployees = async (req, res) => {
  const error = req.query.error;

  res.render("admin/employees/new", { error });
};

let createEmployee = async (req, res) => {
  try {
    req.body.role = "1";

    if (req.body.dayOfBirth) {
      req.body.dayOfBirth = moment(
        req.body.dayOfBirth, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    if (req.body.password && req.body.password.trim() !== "") {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      req.body.password;
    }

    await User.create(req.body);
    res.redirect("/admin/employees");
  } catch (error) {
    let errorMessage = "Lỗi khi tạo nhân viên";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          return `• ${err.message}`;
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(
      `/admin/employees/new?error=${encodeURIComponent(errorMessage)}`
    );
  }
};

let editEmployee = async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).send("Nhân viên không tồn tại");
    }

    const error = req.query.error;

    res.render("admin/employees/edit", { formData: employee, moment, error });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let updateEmployee = async (req, res) => {
  try {
    const employee = await User.findByPk(req.params.id);
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

    res.redirect(`/admin/employees/edit/${employee.id}`);
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

    res.redirect(
      `/admin/employees/edit/${req.params.id}?error=${
        encodeURIComponent(errorMessage)
      }`
    );
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

let newTaskEmployees = async (req, res) => {
  try {
    const whereCondition = {
      deletedAt: null,
      role: "employee"
    }

    const { rows } = await User.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    const error = req.query.error;

    res.render("admin/employees/tasks/new", {
      employees: rows,
      moment: moment,
      error
    })
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let createTaskEmployees = async (req, res) => {
  try {
    if (req.body.startDate) {
      req.body.startDate = moment(
        req.body.startDate, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    if (req.body.endDate) {
      req.body.endDate = moment(
        req.body.endDate, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    await Task.create(req.body)
    res.redirect("/admin/employees/task/new");
  } catch (error) {
    let errorMessage = "Lỗi khi tạo công việc";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          return `• ${err.message}`;
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(
      `/admin/employees/task/new?error=${encodeURIComponent(errorMessage)}`
    );
  }
};

module.exports = {
  getEmployees,
  newEmployees,
  createEmployee,
  editEmployee,
  updateEmployee,
  deleteEmployee,
  newTaskEmployees,
  createTaskEmployees
};
