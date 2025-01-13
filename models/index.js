const sequelize = require('../config/database');
const Addons = require('./addons')(sequelize);
const Booking = require('./booking')(sequelize);
const BookingRooms = require('./bookingRooms')(sequelize);
const BookingAddon = require('./bookingAddon')(sequelize);
const Customer = require('./customer')(sequelize);
const Rooms = require('./rooms')(sequelize);
const SubAddon = require('./subaddon')(sequelize);
const Employee = require('./employee')(sequelize);;
const Role = require('./roles')(sequelize);
const Permission = require('./permission')(sequelize);
const RoomType = require('./rommType')(sequelize);
const Pages = require('./pages')(sequelize);
const Complaints = require('./complaint')(sequelize);
const Sessions = require('./session')(sequelize);

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

Addons.hasMany(SubAddon, {
  foreignKey: 'add on_id',
  as: 'SubAddon'
});

SubAddon.belongsTo(Addons, {
  foreignKey: 'addon_id',
  as: 'Addon' // Alias for the join
});

// Bookings
Customer.hasMany(Booking, { foreignKey: 'customer_id' });
Booking.belongsTo(Customer, { foreignKey: 'customer_id' });

// Rooms
Rooms.hasMany(BookingRooms, { foreignKey: 'room_id' });
BookingRooms.belongsTo(Rooms, { foreignKey: 'room_id' });



Booking.hasMany(BookingRooms, { foreignKey: 'booking_id' });
BookingRooms.belongsTo(Booking, { foreignKey: 'booking_id' });

// Addons
Addons.hasMany(BookingAddon, { foreignKey: 'addon_id' });
BookingAddon.belongsTo(Addons, { foreignKey: 'addon_id' });

// BookingRooms to Addons
BookingRooms.hasMany(BookingAddon, { foreignKey: 'booking_room_id' });
BookingAddon.belongsTo(BookingRooms, { foreignKey: 'booking_room_id' });


// sequelize.sync({ force: true }) // Use { force: true } only in development; it drops existing tables!
//   .then(() => {
//     console.log('Database & tables created!');
//   })
//   .catch((err) => {
//     console.error('Error creating tables:', err);
//   });

module.exports = {
  sequelize,
  Role,
  Permission,
  Addons,
  SubAddon,
  Customer,
  Rooms,  
  Employee,
  Booking,
  BookingRooms,
  BookingAddon,
  RoomType,
  Pages,
  Complaints,
  Sessions
};
