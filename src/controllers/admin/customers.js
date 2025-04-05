const moment = require("moment");
const { Op, ValidationError } = require("sequelize");
const { Customer } = require("../../../models");

let getCustomers = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const searchQuery = req.query.search || "";

  try {
    const whereCondition = {
      deletedAt: null,
    };

    if (searchQuery) {
      whereCondition.documentNumber = { [Op.like]: `%${searchQuery}%` };
    }

    const { count, rows } = await Customer.findAndCountAll({
      where: whereCondition,
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);


    const error = req.query.error;

    res.render("admin/customers/index", {
      customers: rows,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      moment: moment,
      searchQuery: searchQuery,
      error
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let newCustomers = async (req, res) => {
  res.render("admin/customers/new");
}

let createCustomer = async (req, res) => {
  try {
    if (req.body.dayOfBirth) {
      req.body.dayOfBirth = moment(
        req.body.dayOfBirth, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    if (req.body.createdAtCard) {
      req.body.createdAtCard = moment(
        req.body.createdAtCard, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    await Customer.create(req.body);
    res.redirect("/admin/customers");
  } catch (error) {
    let errorMessage = "Lỗi khi tạo khách hàng";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          if (err.type === "unique violation" && err.path === "cardID") {
            return "• ID thẻ đã tồn tại";
          } else {
            return `• ${err.message}`;
          }
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(`/admin/customers?error=${encodeURIComponent(errorMessage)}`);
  }
}

let editCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).send("Khách hàng không tồn tại");
    }

    res.render("admin/customers/edit", {formData: customer, moment});
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

let updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (req.body.dayOfBirth) {
      req.body.dayOfBirth = moment(
        req.body.dayOfBirth, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    if (req.body.createdAtCard) {
      req.body.createdAtCard = moment(
        req.body.createdAtCard, "DD-MM-YYYY"
      ).format("YYYY-MM-DD");
    }

    await customer.update(req.body);

    res.redirect(`/admin/customers/edit/${customer.id}`);
  } catch (error) {
    let errorMessage = "Lỗi khi cập nhật khách hàng";

    if (error instanceof ValidationError) {
      const errors = error.errors
        .map((err) => {
          if (err.type === "unique violation" && err.path === "cardID") {
            return "• ID thẻ đã tồn tại";
          } else {
            return `• ${err.message}`;
          }
        })
        .join("<br>");

      errorMessage += "<br>" + errors;
    }

    res.redirect(`/admin/customers?error=${encodeURIComponent(errorMessage)}`);
  }
}

let deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).send("Khách hàng không tồn tại");
    }

    await customer.destroy();

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getCustomers,
  newCustomers,
  createCustomer,
  editCustomer,
  updateCustomer,
  deleteCustomer
};
