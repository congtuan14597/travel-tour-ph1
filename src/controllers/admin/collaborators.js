const moment = require("moment");
const { ValidationError } = require("sequelize");
const { User } = require("../../../models");
const bcrypt = require("bcrypt");

let getCollaborators = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const whereCondition = {
      deletedAt: null,
      role: "2"
    };

    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.render("admin/collaborators/index", {
      collaborators: rows,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      moment: moment,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let newCollaborators = async (req, res) => {
  const error = req.query.error;

  res.render("admin/collaborators/new", { error });
};

let createCollaborator = async (req, res) => {
  try {
    req.body.role = "2";

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
    res.redirect("/admin/collaborators");
  } catch (error) {
    let errorMessage = "Lỗi khi tạo cộng tác viên";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          return `• ${err.message}`;
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(
      `/admin/collaborators/new?error=${encodeURIComponent(errorMessage)}`
    );
  }
};

let editCollaborator = async (req, res) => {
  try {
    const collaborator = await User.findByPk(req.params.id);

    if (!collaborator) {
      return res.status(404).send("Cộng tác viên không tồn tại");
    }

    const error = req.query.error;

    res.render(
      "admin/collaborators/edit", {formData: collaborator, moment, error}
    );
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let updateCollaborator = async (req, res) => {
  try {
    const collaborator = await User.findByPk(req.params.id);

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

    await collaborator.update(req.body);

    res.redirect(`/admin/collaborators/edit/${collaborator.id}`);
  } catch (error) {
    let errorMessage = "Lỗi khi chỉnh sửa cộng tác viên";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          return `• ${err.message}`;
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(
      `/admin/collaborators/edit/${req.params.id}?error=${
        encodeURIComponent(errorMessage)
      }`
    );
  }
};

let deleteCollaborator = async (req, res) => {
  try {
    const collaborator = await User.findByPk(req.params.id);

    if (!collaborator) {
      return res.status(404).send("Cộng tác viên không tồn tại");
    }

    await collaborator.destroy();

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getCollaborators,
  newCollaborators,
  createCollaborator,
  editCollaborator,
  updateCollaborator,
  deleteCollaborator
};
