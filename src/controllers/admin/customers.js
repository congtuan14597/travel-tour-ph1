const moment = require("moment");
const { Op } = require("sequelize");
const { Customer } = require("../../../models");

let getCustomers = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const searchQuery = req.query.search || "";

  try {
    const whereCondition = {};
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

    res.render("admin/customers/index", {
      customers: rows,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      moment: moment,
      searchQuery: searchQuery
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

let newCustomers = async (req, res) => {
  res.render("admin/customers/new");
}

module.exports = {
  getCustomers,
  newCustomers
};
