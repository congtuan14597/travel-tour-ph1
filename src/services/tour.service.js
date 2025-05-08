const { Op } = require("sequelize");

function buildTourFilter(query) {
  const {
    name, destination, departure, type, priceMin, priceMax
  } = query;

  const where = {
    deletedAt: null
  };

  if (name) {
    where.name = { [Op.like]: `%${name}%`}
  }

  if (destination) {
    where.destination = { [Op.like]: `%${destination}%`}
  }

  if (departure) {
    where.departure = { [Op.like]: `%${departure}%`}
  }

  if (type) {
    where.type = type;
  }

  if (priceMin && priceMax) {
    where.price = { [Op.between]: [priceMin, priceMax] };
  } else if (priceMin) {
    where.price = { [Op.gte]: priceMin };
  } else if (priceMax) {
    where.price = { [Op.lte]: priceMax };
  }

  return where;
}

module.exports = {
  buildTourFilter
};
