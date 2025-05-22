const { Booking, Tour, User } = require("../../models");
const { Op } = require("sequelize");

const calculateRevenue = (bookingData) => {
  const people = bookingData.numberPeople || 0;
  const price = bookingData.tours?.price || 0;
  const vatIncluded = bookingData.tours?.vatIncluded;
  return vatIncluded ? people * price : people * price * 1.1;
};

const getDateRange = (year, monthName) => {
  const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);
  return { startDate, endDate };
};

const buildBookingWhereClause = (startDate, endDate, currentDate) => ({
  [Op.or]: [
    { endDate: { [Op.lt]: currentDate } },
    { status: "4" }
  ],
  [Op.and]: [
    {
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: startDate } },
            { endDate: { [Op.gte]: endDate } }
          ]
        }
      ]
    },
    { deletedAt: null }
  ]
});

const getCompletedBookingsByMonth = async (month) => {
  const [year, monthName] = month.split("-");
  const currentDate = new Date();
  const { startDate, endDate } = getDateRange(year, monthName);

  const bookings = await Booking.findAll({
    where: buildBookingWhereClause(startDate, endDate, currentDate),
    include: [
      {
        model: Tour,
        as: "tours",
        attributes: ["name", "price", "vatIncluded"]
      },
      {
        model: User,
        as: "users",
        attributes: ["name", "email", "phoneNumber"]
      }
    ],
    order: [["startDate", "DESC"]]
  });

  const bookingsWithRevenue = bookings.map(booking => ({
    ...booking.toJSON(),
    revenue: calculateRevenue(booking.toJSON())
  }));

  const totalBookings = bookingsWithRevenue.length;
  const totalCustomers = bookingsWithRevenue.reduce(
    (sum, booking) => sum + booking.numberPeople,
    0
  );
  const totalRevenue = bookingsWithRevenue.reduce(
    (sum, booking) => sum + booking.revenue,
    0
  );

  return {
    month,
    bookings: bookingsWithRevenue,
    totalBookings,
    totalCustomers,
    totalRevenue
  };
};

module.exports = {
  getCompletedBookingsByMonth
};
