const moment = require("moment");
const { ValidationError } = require("sequelize");
const { User } = require("../../../models");
const bcrypt = require("bcrypt");

let editCollaborator = async (req, res) => {
  try {
    const userId = req.user.id;
    const collaborator = await User.findByPk(userId);

    if (!collaborator) {
      return res.status(404).send("Cộng tác viên không tồn tại");
    }

    const error = req.query.error;

    res.render("user/collaborators/edit", { formData: collaborator, moment, error });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let updateCollaborator = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const collaborator = await User.findByPk(userId);

    if (!collaborator) {
      return res.status(404).send("Cộng tác viên không tồn tại");
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

    await collaborator.update(updateData);

    res.redirect("/collaborators/edit");
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

    res.redirect(`/collaborators/edit?error=${encodeURIComponent(errorMessage)}`);
  }
};

module.exports = {
  editCollaborator,
  updateCollaborator,
};
