const sequelize = require('../config/database');
const Addons = require('./addons')(sequelize);
const Booking = require('./booking')(sequelize);
const BookingTransactions = require('./bookingTransactions')(sequelize);
const BookingAddon = require('./bookingAddon')(sequelize);
const Customer = require('./customer')(sequelize);
const Rooms = require('./rooms')(sequelize);
const Employee = require('./employee')(sequelize);;
const Role = require('./roles')(sequelize);
const Permission = require('./permission')(sequelize);
const RoomType = require('./rommType')(sequelize);
const Pages = require('./pages')(sequelize);
const Complaints = require('./complaint')(sequelize);
const Sessions = require('./session')(sequelize);
const PaymentMode = require('./paymentMode')(sequelize);
const AddonType = require('./addonType')(sequelize);
const CronJobLogs = require('./cronjob-logs')(sequelize)
// Define Associations
Role.belongsToMany(Permission, {
  through: 'RolePermissions',
  foreignKey: 'role_id',
});
Permission.belongsToMany(Role, {
  through: 'RolePermissions',
  foreignKey: 'permission_id',
});
Role.hasMany(Employee, {
  foreignKey: 'role_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Employee.belongsTo(Role, {
  foreignKey: 'role_id',
});

// Addons.hasMany(SubAddon, {
//   foreignKey: 'addon_id',
//   as: 'SubAddon'
// });

// SubAddon.belongsTo(Addons, {
//   foreignKey: 'addon_id',
//   as: 'Addon' // Alias for the join
// });

// Bookings
Customer.hasMany(Booking, { foreignKey: 'customer_id' });
Booking.belongsTo(Customer, { foreignKey: 'customer_id' });

// Rooms
Rooms.hasMany(Booking, { foreignKey: 'room_id' });
Booking.belongsTo(Rooms, { foreignKey: 'room_id' });

// Booking.hasMany(BookingRooms, { foreignKey: 'booking_id' });
// BookingRooms.belongsTo(Booking, { foreignKey: 'booking_id' });

Booking.hasMany(BookingTransactions, { foreignKey: 'booking_id' });
BookingTransactions.belongsTo(Booking, { foreignKey: 'booking_id' });

// Addons
Addons.hasMany(BookingAddon, { foreignKey: 'addon_id' });
BookingAddon.belongsTo(Addons, { foreignKey: 'addon_id' });

// BookingRooms to Addons
Booking.hasMany(BookingAddon, { foreignKey: 'booking_id' });
BookingAddon.belongsTo(Booking, { foreignKey: 'booking_id' });


sequelize.sync({ alter: true }) // Use { alter: true } to modify existing tables without dropping them
  .then(() => {
    console.log('Database & tables synchronized!');
  })
  .catch((err) => {
    console.error('Error syncing tables:', err);
  });

module.exports = {
  sequelize,
  Role,
  Permission,
  Addons,
  Customer,
  Rooms,  
  Employee,
  Booking,
  BookingAddon,
  RoomType,
  Pages,
  Complaints,
  Sessions,
  PaymentMode,
  AddonType,
  BookingTransactions,
  CronJobLogs
};
