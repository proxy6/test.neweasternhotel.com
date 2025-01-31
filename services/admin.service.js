const { DATE } = require('sequelize');
const { Role, Permission, Addons, Rooms, Employee, Customer, Booking, BookingAddon, RoomType, Pages, Complaints, PaymentMode, AddonType, BookingTransactions } = require('../models');
// const Booking = require('../models/booking');
const { sequelize } = require('../models'); // Database connection
const { Op } = require('sequelize'); // Import Sequelize operators

// const bookingRooms = require('../models/bookingRooms');


class AdminService{
//ROLES LOGIC
static async createRoleWithPermissions(roleName, permissions){
    const role = await Role.create({ name: roleName });
  for (const { table, actions } of permissions) {

    for (const action of actions) {
     const [permission] = await Permission.findOrCreate({ where: { table, action } });
     await role.addPermission(permission);
    }
  }
  return role;

}

static async fetchRoles(){
  const roles = await Role.findAll();

  return roles;

}
static async countRoles(){
  const roleCount = await Role.count({

  })
  return roleCount

}
static async getAllRolesWithPermissions(page, limit){
  let offset = 0;
  if(page == null){
       page = 1; 
  }
   // page number
  offset = limit * (page - 1);
  const roles = await Role.findAll({
    limit:limit,
    offset:offset,
    include: {
      model: Permission,
      as: 'Permissions',  // Ensure this matches your association alias
      through: { attributes: [] }, // Exclude join table data
    },
  });

  return roles;

}

static async getAllPages(){
  const pages = await Pages.findAll({

  });
  return pages
}
static async getSingleRoleWithPermissions(roleId){
  const role = await Role.findOne({
    where:{
      id: roleId
    },
    include: {
      model: Permission,
      as: 'Permissions',  // Ensure this matches your association alias
      through: { attributes: [] }, // Exclude join table data
    },
  });

  return role;

}

// static async updateRole(roleId, roleName, permissions){
//   // Find role by ID
//   const role = await Role.findByPk(roleId, { include: Permission });
//   if (!role) throw new Error('Role not found');

//   // Update role name
//   await role.update({ name: roleName });

//   // Clear previous permissions
//   await role.setPermissions([]);

//   // Reassign permissions
//   for (const { table, actions } of permissions) {
//     if (!actions || !Array.isArray(actions)) continue;

//     for (const action of actions) {
//       const [permission] = await Permission.findOrCreate({
//         where: { table, action },
//       });
//       await role.addPermission(permission);
//     }
//   }

//   return role.reload({ include: Permission });
// }


static async updateRole(roleId, roleName, updatedPermissions) {
  const role = await Role.findByPk(roleId, {
      include: [Permission], // Include current permissions
  });

  if (!role) {
      throw new Error('Role not found');
  }

  //   // Update role name
  await role.update({ name: roleName });

  const currentPermissions = role.Permissions.map(p => ({
      table: p.table,
      action: p.action
  }));

  // Prepare new permissions to add
  const permissionsToAdd = [];

  for (const { table, actions } of updatedPermissions) {
      // Ensure 'table' is always passed as a string
      if (typeof table !== 'string') {
          throw new Error(`Invalid table name: ${table}`);
      }

      // If actions is not an array or is missing, treat it as an empty array
      const validActions = Array.isArray(actions) ? actions : (actions ? [actions] : []);

      for (const action of validActions) {
          // Ensure action is a string
          if (typeof action !== 'string') {
              throw new Error(`Invalid action: ${action}`);
          }

          const exists = currentPermissions.some(p => p.table === table && p.action === action);
          if (!exists) {
              permissionsToAdd.push({ table, action });
          }
      }
  }

  const permissionsToRemove = currentPermissions.filter(p => {
      return !updatedPermissions.some(up => up.table === p.table && (up.actions || [up.action]).includes(p.action));
  });

  // Remove permissions
  for (const { table, action } of permissionsToRemove) {
      const permission = await Permission.findOne({ where: { table, action } });
      if (permission) {
          await role.removePermission(permission);
      }
  }

  // Add new permissions
  for (const { table, action } of permissionsToAdd) {
      const [permission] = await Permission.findOrCreate({
          where: { table, action }, // Ensure only strings are passed here
      });
      await role.addPermission(permission);
  }

  return role;
}



static async deleteRole(roleId){
 // Find the role by ID
 const role = await Role.findByPk(roleId, { include: Permission });
 if (!role) throw new Error('Role not found');

 // Remove associated permissions
 await role.setPermissions([]);

 // Delete the role
 await role.destroy();
}


// Employees LOGIC
static async countEmployee(){
  const employeeCount = await Employee.count({
    include: {
      model: Role,
      as: 'Role'
    },
  })
  return employeeCount

}
static async countEmployeeByRole() {
  const employeeCount = await Employee.findAll({
    attributes: [
      [sequelize.col('Employee.role_id'), 'role_id'], // Explicitly specify Employee's role_id
      [sequelize.fn('COUNT', sequelize.col('Employee.id')), 'count'] // Explicitly specify Employee's id
    ],
    include: {
      model: Role,
      attributes: ['id', 'name'] // Include role details
    },
    group: ['Role.id'] // Group by Role.id
  });
  return employeeCount;
}


static async getAllEmployeesWithRole(page, limit){
  let offset = 0;
  if(page == null){
       page = 1; 
  }
   // page number
  offset = limit * (page - 1);

  const Employees = await Employee.findAll({
    offset,
    limit,
    include: {
      model: Role,
      as: 'Role'
    },
  });
  return Employees
}

static async addEmployee(data){
  const employee = await Employee.create({ 
    first_name: data.first_name,
    middle_name: data.middle_name ?? '',
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    country_code: data.country_code,
    password: data.password,
    dob: data.dob,
    profile_pic:  data['profile_pic'],
    gender: data.gender,
    role_id: data.role_id,
    status: data.status,
    country: data.country,
    state: data.state,
    city: data.city,
    address: data.address,
    account_name: data.account_name,
    account_no: data.account_no,
    bank_name: data.bank_name,
    referee_name: data.referee_name,
    referee_phone: data.referee_phone,
    referee_address: data.referee_address
  
  });
return employee;

}
static async updateEmployeeStatus(data){
  if(data.status == '1'){
    await Employee.update({
      status: true
    },
  {
    where:{
      id: data.id
    }
  })
    return true
  }else if(data.status == '0'){
    await Employee.update({
      status: false
    },
  {
    where:{
      id: data.id
    }
  })
    return true
  }else{
    return false
  }

}
static async getSingleEmployee(employeeId){
  const employee = await Employee.findOne({
    where:{
      id: employeeId
    },
    include: {
      model: Role,
      as: 'Role',  // Ensure this matches your association alias
    },
  })
  return employee
}

static async VerifyEmployee(request){
  const employee = await Employee.findOne({
      where:{
          email: request.email,
          otp: request.otp
      },
      
  })
//   if(employee){
//   await Employee.update(
//       { confirm_email: true},
//       { where:{ email: request.email}
//   })
// }
  return employee
}

static async getSingleEmployeeByEmail(email){
  const employee = await Employee.findOne({
    where: {
      email: email
    },
    include: [
      {
        model: Role,
        as: 'Role', // Ensure this matches the alias in associations
        include: [
          {
            model: Permission, // Include permissions related to the role
            through: { attributes: [] }, // Exclude intermediate table attributes
          }
        ]
      }
    ]
  });
  return employee;
  
}
static async updateSingleEmployee(data){
  const employee = await Employee.update({
    first_name: data.first_name,
    middle_name: data.middle_name ?? '',
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    country_code: data.country_code,
    password: data.password,
    dob: data.dob,
    profile_pic:  data['profile_pic'],
    gender: data.gender,
    role_id: data.role_id,
    status: data.status,
    country: data.country,
    state: data.state,
    city: data.city,
    address: data.address,
    account_name: data.account_name,
    account_no: data.account_no,
    bank_name: data.bank_name,
    referee_name: data.referee_name,
    referee_phone: data.referee_phone,
    referee_address: data.referee_address
  
  },{
    where:{
      id: data.id
    }
  })
}

static async updateEmployeePassword(data){
  const [affectedRows] = await Employee.update({
    
    password: data.password,
    confirm_email: true
   
  },{
    where:{
      email: data.email
    }
  })
  if(affectedRows > 0){
    return true
  }else{
    return false
}
}
static async deleteEmployee(employeeId){
  // Find the Employee by ID
  console.log(employeeId)
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error('Employee not found');
 
 console.log(employee)
  // Delete the Employee
  await employee.destroy();
  // await employee.destroy();
 }


//  ADDON LOGIC
static async countAddon(){
  const addonCount = await Addons.count({
  })
  return addonCount

}

static async getAddonTypes(page){
  const addonTypes = await AddonType.findAll({

  });
  return addonTypes
}
static async getAllAddons(page, limit){
  let offset = 0;
  if(page == null){
       page = 1; 
  }
   // page number
  offset = limit * (page - 1);
  const addon = await Addons.findAll({
    offset,
    limit,
  });
  return addon
}

static async getAllAddonsByType(type){

  const addon = await Addons.findAll({
    where:{
      type: type
    },
  });
  return addon
}
static async addAddon(data){

  const addon = await Addons.create({ 
    name: data.name,
    type: data.type,
    status: data.status
  });
return addon;

}
static async getSingleAddon(data){
    const addon = await Addons.findOne({
      where:{
        id: data.id
      }
    })
    return addon
  
}
static async updateSingleAddon(data){
    const addon = await Addons.update({ 
    name: data.name,
    type: data.type,
    status: data.status,
    
  },
  {
    where:{
      id: data.id
    }
  });
  

}
static async deleteAddon(addonId){
//delete addon
  await Addons.destroy({
    where:{
      id: addonId
    }
  })
}



// ROOMS LOGIC
static async countRooms(){
  const roomCount = await Rooms.count({
    
  })
  return roomCount

}
static async availableRoomCount() {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Query for available rooms count -- removed to use only status in room
    // const availableRooms = await Rooms.count({
    //   where: {
    //     type: { [Op.ne]: 'others' }, // Exclude rooms of type 'others'
    //     id: {
    //       [Op.notIn]: sequelize.literal(`
    //         (
    //           SELECT room_id
    //           FROM Bookings AS br
    //           JOIN Rooms AS r ON br.room_id = r.id
    //           WHERE 
    //             (r.type = 'others' OR br.status IN ('checkedin')) AND
    //             ('${today}' BETWEEN br.check_in_date AND br.check_out_date)
    //         )
    //       `), // Exclude room_ids that are of type 'others' or have conflicting bookings
    //     },
    //   },
    // });

    const availableRooms = await Rooms.count({
      where: {
        type: { [Op.ne]: 'others' }, // Exclude rooms of type 'others'
        status: true, // Only count rooms where status === true
      },
    });

    return availableRooms;
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    throw error;
  }
}


static async countPendingCleanedRooms(){
  const roomCount = await Rooms.count({
    where:{
      clean_status: "needs cleaning"
    }
  })
  return roomCount

}

static async countPendingRetouchedRooms(){
  const roomCount = await Rooms.count({
    where:{
      clean_status: "needs retouch"
    }
  })
  return roomCount

}

// static async availableRoomCount(){
//   const roomCount = await Rooms.count({
//     where:{
//       status: true
//     }

//   })
//   return roomCount

// }

static async availableRoom(roomId, checkIn, checkOut){
  

  const overlappingBookings = await Booking.findAll({
    where: {
      // room_id: { [Op.ne]: roomId }, // Exclude the room with the specified roomId
      room_id:  roomId , // Exclude the room with the specified roomId
      status: { [Op.in]: ['checkedin', 'pending'] },
      [Op.or]: [
        {
          check_in_date: { [Op.between]: [checkIn, checkOut] }
        },
        {
          check_out_date: { [Op.between]: [checkIn, checkOut] }
        },
        {
          [Op.and]: [
            { check_in_date: { [Op.lte]: checkIn } },
            { check_out_date: { [Op.gte]: checkOut } }
          ]
        }
      ]
    }
  });

  
 return overlappingBookings 

}


static async availableRoomForEditBooking(roomId, checkIn, checkOut){
  

  const overlappingBookings = await Booking.findAll({
    where: {
      // room_id: { [Op.ne]: roomId }, // Exclude the room with the specified roomId
      room_id:  roomId , // Exclude the room with the specified roomId
      status: { [Op.in]: ['checkedin', 'pending'] },
      [Op.or]: [
        {
          check_in_date: { [Op.between]: [checkIn, checkOut] }
        },
        {
          check_out_date: { [Op.between]: [checkIn, checkOut] }
        },
        {
          [Op.and]: [
            { check_in_date: { [Op.lte]: checkIn } },
            { check_out_date: { [Op.gte]: checkOut } }
          ]
        }
      ]
    }
  });

  
 return overlappingBookings 

}


static async bookedRoomCount(){
  const roomCount = await Booking.count({
    distinct: true, // Enable distinct counting
    col: 'room_id', // Specify the column to count distinct values
    where: {
      status: {
        [Op.in]: ['pending', 'checkedin'], // Check for multiple statuses
      },
    },
  });
  return roomCount;

}
 
static async getAllRooms(page){
  const room = await Rooms.findAll({

  });
  return room
}
static async sendRoomRequest(request, roomId){
  const room = await Rooms.findOne({
    where:{
      id: roomId
    }
  });
  if (request == "clean"){
    room.clean_status = "needs cleaning"
  }else if(request == "retouch"){
    room.clean_status = 'needs retouch';
  }
  await room.save();
  return room
}
static async getAllRoomsByType(type){
  const room = await Rooms.findAll({
    where:{
      type
    }
  });
  return room
}
static async getRoomTypes(page){
  const roomType = await RoomType.findAll({

  });
  return roomType
}

static async getPaymentMode(){
  const paymentMode = await PaymentMode.findAll({

  });
  return paymentMode
}

static async getAllRooms(page, limit){
  let offset = 0;
  if(page == null){
       page = 1; 
  }
   // page number
  offset = limit * (page - 1);
  const room = await Rooms.findAll({
    offset,
    limit
  });
  return room
}
static async getActivePaginatedRooms(page, limit){
  let offset = 0;
  if(page == null){
       page = 1; 
  }
   // page number
  offset = limit * (page - 1);
  const room = await Rooms.findAll({
    offset,
    limit,
    where:{
      status: true
    },
    order: [['createdAt', 'DESC']] // Order by most recent
  });
  return room
}
static async getAllActiveRooms(){
  const room = await Rooms.findAll({
    where:{
      status: true
    }

  });
  return room
}

static async getAllUnpaginatedRooms(){

  const room = await Rooms.findAll({
  
  });
  return room
}
static async getSingleRoom(roomId){
  const room = await Rooms.findOne({
    where:{
      id: roomId
    }
  });
  return room
}
static async addRoom(data){
  const room = await Rooms.create({ 
    number: data.number,
    type: data.type,
    price: data.price,
    status: data.status,
    
  });
return room;

}
static async updateRoomStatus(data){

    //check if a booking currentllt has it in use
    const booking  = await Booking.findOne({
      where:{
        room_id: data.id,
        status: {
          [Op.not]: 'checkedout' // Exclude 'checkedout' status
        }
      }
    })

    if(booking){
      return false
    }
  if(data.status == '1'){
    await Rooms.update({
      status: true
    },
  {
    where:{
      id: data.id
    }
  })
    return true
  }else if(data.status == '0'){
    await Rooms.update({
      status: false
    },
  {
    where:{
      id: data.id
    }
  })
    return true
  }else{
    return false
  }

}

static async updateSingleRoom(data){
  const room = await Rooms.update({
    number: data.number,
    type: data.type,
    price: data.price,
    status: data.status,
  
  },{
    where:{
      id: data.id
    }
  })
}

static async markRoomAsCleaned(data){
  const room = await Rooms.update({
    clean_status: "cleaned",
    cleanedAt: new Date()
  
  },{
    where:{
      id: data.id
    }
  })
}

static async markRoomAsRetouched(data){
  const room = await Rooms.update({
    clean_status: "retouched",
    retouchedAt: new Date()
  
  },{
    where:{
      id: data.id
    }
  })
}
static async deleteRoom(roomId){
  await Rooms.destroy({
    where:{
      id: roomId
    }
  });
 }



 //BOOKING LOGIC
 static async CountBookings(){
 const booking = await Booking.count()
 return booking
}

 static async CountTodayBookings(){
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day
 // Count bookings for today
    const bookingCount = await Booking.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay], // Filter by today's date
        },
      }
    });

    return bookingCount; // Return the count

}

static async CountThisWeeksBookings(){
  const today = new Date();

    // Get the start and end of the current week
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0); // Reset to midnight

    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // End of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999); // End of the day

    // Count bookings for today
    const bookingCount = await Booking.count({
      where: {
        createdAt: {
          [Op.between]: [startOfWeek, endOfWeek], // Filter by this week's date range
        },
      }
    });

    return bookingCount; // Return the count

}
 
 
static async getAllBookings(page, limit){
        let offset = 0;
        if(page == null){
             page = 1; 
        }
         // page number
        offset = limit * (page - 1);
        const booking = await Booking.findAll({
          limit: limit,
          offset: offset,
          include: [
    
            {
              model: Customer,
      
            },
            {
              model: Rooms,
            
          },
            
          ],
          order: [['id', 'DESC']] // Order by most recent
        });



  return  booking
}
static async getSingleBooking(bookingId){
  const booking = await Booking.findOne({
    include:[
      {
        model: Customer,
    },
    
    {
      model: Rooms
    },
    {
      model: BookingAddon
    }
  ],
    where:{
      id: bookingId
    },
    
  });
  return booking
  
}
static async getBookingsForReceipt(bookingId){
  let booking = await Booking.findOne({
    include:[
      {
        model: Customer,
    },
    
    {
      model: Rooms
    },
    {
      model: BookingAddon
    }
  ],
    where:{
      id: bookingId
    },
    
  });

  //check if other bookings exist for that reference
  if(booking.booking_reference){
    booking = await Booking.findAll({
      include:[
        {
          model: Customer,
      },
      
      {
        model: Rooms
      },
      {
        model: BookingAddon
      }
    ],
      where:{
        booking_reference: booking.booking_reference
      },
    })
  }
  return booking
  
}

static async getSingleReceipt(bookingId){
  let booking = await Booking.findAll({
    include:[
      {
        model: Customer,
    },
    
    {
      model: Rooms
    },
    {
      model: BookingAddon
    }
  ],
    where:{
      id: bookingId
    },
    
  });

 
  return booking
  
}

static async checkinBooking(bookingId,user){
  const booking = await Booking.findOne({
    where:{
      id: bookingId
    }
    
  });
  //check if this room should be checked in
  //
  let today = new Date();
  today.setHours(0, 0, 0, 0); 

  const checkInDate = new Date(booking.check_in_date);
  checkInDate.setHours(0, 0, 0, 0); 

  let checkOutDate = booking.check_out_date ? new Date(booking.check_out_date) : null;
  if (checkOutDate) {
      checkOutDate.setHours(0, 0, 0, 0); 
  }

  if (today >= checkInDate && (!checkOutDate || today <= checkOutDate)) { 
    booking.check_in_date = today.toLocaleDateString();
    booking.status = "checkedin"
    today = new Date(); // This overrides the previous reset
    booking.check_in_time = today.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    booking.last_updated_by = `${user.first_name} ${user.last_name}`
    await booking.save()

  // update room status 
  await Rooms.update(
    { status: true },
    { where: { id: booking.room_id } });
  }
  return booking
}

static async checkoutBooking(bookingId,user){
  const booking = await Booking.findOne({
    where:{
      id: bookingId
    }
    
  });
  //check if this room should be checked in
  //
  let today = new Date();
  today.setHours(0, 0, 0, 0); 

  
    booking.check_out_date = today.toLocaleDateString();
    booking.status = "checkedout"
    today = new Date(); // This overrides the previous reset
    booking.check_out_time = today.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    booking.checkedout_by = `${user.first_name} ${user.last_name}`
     booking.last_updated_by = `${user.first_name} ${user.last_name}`
    await booking.save()

    //update room status
    await Rooms.update(
      { status: false },
      { where: { id: booking.room_id } });
  
    
  return booking
}

static async extendBooking(bookingId, data, user){
  const booking = await Booking.findOne({
    include: [
      {
        model: Rooms, // Include the Room details
        
      }
    ],
    where:{
      id: bookingId
    }
    
  });

  
  // TODO: check if this room can be extended for the specified date
  //

  //check extended book days 
  const newCheckout = new Date(data.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
  const oldCheckout = new Date(booking.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight

  // Calculate the difference in days
  let booked_days_no = (newCheckout - oldCheckout) / 86400000;
  // let booked_days_no = new Date(data.check_out_date).setHours(0,0,0,0) -  new Date(booking.check_out_date).setHours(0,0,0,0) / 86400000
  console.log("booked_days_no")
  console.log(booked_days_no)
    
  if (booked_days_no > 0) {
      booked_days_no = booked_days_no
          
  }else{
        booked_days_no = 1
  }

    booking.check_out_date = data.check_out_date
    booking.booked_days_no = booking.booked_days_no + booked_days_no
    booking.last_updated_by = `${user.first_name} ${user.last_name}`
    await booking.save()

    //add to booking transactions
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; 
   
    await BookingTransactions.create(
      {
        booking_id: booking.id,
        description: `Extended Booking for romm ${booking.Room.number} by ${booked_days_no} days `,
        payment_mode: data.payment_mode,
        amount: booking.Room.price,
        date: formattedDate,
        employee_id: `${user.first_name} ${user.last_name}`,
      
    });
  
  return booking
}

static async getBooking(bookingId) {
  const booking = await Booking.findAll({
    include: [
      {
        model: Rooms, // Include the Room details
        
      },
      {
        model: BookingAddon, // Include the BookingAddons for each room
        include: [
          {
            model: Addons, // Include the Addons details
      
          }
        ],
       
      }
    ],
    where: {
      booking_id: bookingId
    }
  });

  return booking;
}

static async completeBookingPayment(data){
  const { user } = data;
  let description = '';
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  
  const booking = await Booking.findByPk(data.booking_id);

  if (!booking) throw new Error("Booking not found");
  let amount_paid = parseFloat(booking.amount_paid) + parseFloat(data.amount)
  if(parseFloat(booking.total_price) > (parseFloat(booking.amount_paid) + parseFloat(data.amount))){
    description = "Booking Part Payment"
  }else{
     description = "Booking Complete Payment"
     booking.payment_status = "Full Payment"
  }
    await BookingTransactions.create(
      {
        booking_id: booking.id,
        description: description,
        payment_mode: data.payment_mode,
        amount: data.amount,
        date: formattedDate,
        employee_id: `${user.first_name} ${user.last_name}`,
      
    });

  await booking.update(
    {
     // check_in_time: formData.booking_check_in_time,
      amount_paid: amount_paid,
    }
  );
  
  await booking.save();
  console.log(new Date(new Date().setHours(0, 0, 0, 0)),)
  try {
  } catch (error) {
    console.log(error)
    throw error; // Propagate error
  }
}

static async addBooking(data){
  const { booking_reference, formData, rooms, user } = data;
 
  const transaction = await sequelize.transaction(); // Start transaction

  try {
    // 1. Create Customer
    const customer = await Customer.create(
      {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        nationality: formData.nationality,
        id_type: formData.id_type,
        id_number: formData.id_number,
        id_issue_country: formData.id_issue_country,
        id_exp_date: formData.id_exp_date,
        occupation: formData.occupation,
        bus_type: formData.bus_type,
        last_country_entry_date: formData.last_country_entry_date,
      },
      { transaction }
    );

    // 2. Create Booking
    // Check if any room has a status of 'checkedin'
      const hasCheckedInRoom = rooms.some(room => room.status === 'checkedin'); // Returns true or false
      console.log(hasCheckedInRoom)
      // Dynamically set the booking status based on room status
      const bookingStatus = hasCheckedInRoom ? 'checkedin' : 'pending'; // 'checkedin' if any room has the status

    const booking = await Booking.create(
      {
        customer_id: customer.id,
        booking_reference: booking_reference,
        booked_by: `${user.first_name} ${user.last_name}`,
        payment_mode: formData.payment_mode,
        payment_status: formData.payment_status,
        check_in_date: rooms[0].check_in_date,
        check_in_time: rooms[0].check_in_time,
        status: hasCheckedInRoom ? 'checkedin' : 'pending', // Update status dynamically
        total_price: 0, // Calculate dynamically below
      },
      { transaction }
    );

    let totalPrice = 0;

    // Check for duplicate room IDs
    const roomIds = rooms.map(room => room.room_id); // Extract all room IDs

    const duplicateRooms = roomIds.filter((id, index) => roomIds.indexOf(id) !== index);
    console.log(duplicateRooms)
    if (duplicateRooms.length > 0) {
      console.log('this is a duplicate')
      const overlappingRooms = [];
      // Group rooms by room_id
      const groupedRooms = rooms.reduce((acc, room) => {
        acc[room.room_id] = acc[room.room_id] || [];
        acc[room.room_id].push({
          checkIn: new Date(room.check_in_date).setHours(0, 0, 0, 0),
          checkOut: new Date(room.check_out_date).setHours(0, 0, 0, 0),
        });
        return acc;
      }, {});

      // Check for overlapping dates in each group
      Object.keys(groupedRooms).forEach(roomId => {
        const dates = groupedRooms[roomId];
        for (let i = 0; i < dates.length; i++) {
          for (let j = i + 1; j < dates.length; j++) {
            const range1 = dates[i];
            const range2 = dates[j];
            if (
              range1.checkIn < range2.checkOut &&
              range2.checkIn < range1.checkOut
            ) {
              overlappingRooms.push(roomId);
              break;
            }
          }
        }
      });
      if (overlappingRooms.length > 0) {
       
        if (transaction) await transaction.rollback(); // Rollback transaction if already started
        // ${[...new Set(duplicateRooms)].join(', ')}
        return (`Room is not available for the selected dates`);
      }
    }
    // 3. Create Booking Rooms
    for (const room of rooms) {
      let roomData = await Rooms.findOne({
        where:{
          id: room.room_id
        },
        transaction
      })

      //check if the room is already booked
      let bookingRoomData = await Booking.findOne({
        where: {
          [Op.and]: [
            { room_id: room.room_id }, // Ensure it checks the same room
            { status: { [Op.ne]: 'checkedout' } }, // Ensure status is not 'checkedout'
            {
              [Op.or]: [
                {
                  check_in_date: {
                    [Op.lt]: room.check_in_date, // Existing booking starts before the new check-in date
                  },
                  check_out_date: {
                    [Op.gt]: room.check_in_date, // Existing booking ends after the new check-in date
                  }
                },
                {
                  check_in_date: {
                    [Op.lt]: room.check_out_date, // Existing booking starts before the new check-out date
                  },
                  check_out_date: {
                    [Op.gt]: room.check_out_date, // Existing booking ends after the new check-out date
                  }
                }
              ]
            }
          ]
        },
        transaction
      });
      
      
      if(bookingRoomData){
        
        if (transaction) await transaction.rollback();
        return (`Room ${roomData.name} is already booked for the selected dates`);
      }

      //check for discount and subtract from room price
      // const pricePerDay = room.discount != null && room.discount < roomData.price ? roomData.price - room.discount : roomData.price ;
       // Calculate the difference in days
      // let booked_days_no = new Date(room.check_out_date).setHours(0,0,0,0) - new Date(room.check_in_date).setHours(0,0,0,0) / 86400000
      // console.log("booked_days_no")
      // console.log(booked_days_no)
      // if (booked_days_no >= 0) {
      //   room.booked_days_no = booked_days_no - 1
      //   console.log(room.booked_days_no)
      // }

      if (room.check_in_date && room.check_out_date) {
        const checkInDate = new Date(room.check_in_date).setHours(0, 0, 0, 0); // Normalize time to midnight
        const checkOutDate = new Date(room.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
      
        // Calculate the difference in days
        let booked_days_no = (checkOutDate - checkInDate) / 86400000;
      
        if (booked_days_no > 0) {
          room.booked_days_no = booked_days_no
            
        }else{
          room.booked_days_no = 1
        }
      }
      const roomPrice = room.discount && room.discount < roomData.price * room.booked_days_no
      ? (roomData.price * room.booked_days_no)  - room.discount
      : roomData.price * room.booked_days_no;

      // const roomPrice = pricePerDay * parseInt(room.booked_days_no); // Calculate room price
      await Booking.create(
        {
          booking_id: booking.id,
          room_id: room.room_id,
          check_in_date: room.check_in_date,
          check_in_time: room.check_in_time,
          check_out_date: room.check_out_date,
          booked_days_no: room.booked_days_no,
          no_persons: room.no_persons,
          price: roomPrice,
          discount: room.discount == '' ? 0  : room.discount,
          status: room.status,
        },
        { transaction }
      );

    
      totalPrice += roomPrice; // Accumulate total price
    }

    await Rooms.update(
      { status: false },
      { where: { id: roomIds }, transaction }
    );

    // 4. Update Booking with total price
    if(formData.payment_status == 'Part Payment'){
      booking.amount_paid = formData.part_payment_amount;
      //create  a booking transaction table 
      console.log("BOOKING TRANSACTIONS")
      const todaysDate = new Date();
      const formattedDate = todaysDate.toISOString().split('T')[0];
      await BookingTransactions.create(
        {
          booking_id: booking.id,
          description: "Booking Part Payment",
          payment_mode: formData.payment_mode,
          amount: formData.part_payment_amount,
          date: formattedDate,
          employee_id: `${user.first_name} ${user.last_name}`,
         
        },
        { transaction }
      );

    }else if(formData.payment_status == 'Full Payment'){
      booking.amount_paid = totalPrice;
    }
    booking.total_price = totalPrice;
    await booking.save({ transaction });

    // Commit transaction
    await transaction.commit();

    return booking; // Return booking details
  } catch (error) {
    console.log(error)
    if (transaction) await transaction.rollback();
    throw error; // Propagate error
  }

}

static async addNewBooking(data){
  const { user } = data;
  console.log(data)
  const booking_reference =  'BR-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  console.log(booking_reference)
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    // 1. Create Customer
    const customer = await Customer.create(
      {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        nationality: data.nationality,
        id_type: data.id_type,
        id_number: data.id_number,
        id_issue_country: data.id_issue_country,
        id_exp_date: data.id_exp_date,
        occupation: data.occupation,
        bus_type: data.bus_type,
        last_country_entry_date: data.last_country_entry_date,
      },
      { transaction }
    );

    //check if the room is booked for the those selected dates
    let bookingRoom = await Booking.findOne({
      where: {
        [Op.and]: [
          { room_id: data.room_id }, // Ensure it checks the same room
          { status: { [Op.ne]: 'checkedout' } }, // Ensure status is not 'checkedout'
          {
            [Op.or]: [
              {
                check_in_date: {
                  [Op.lt]: data.check_in_date, // Existing booking starts before the new check-in date
                },
                check_out_date: {
                  [Op.gt]: data.check_in_date, // Existing booking ends after the new check-in date
                }
              },
              {
                check_in_date: {
                  [Op.lt]: data.check_out_date, // Existing booking starts before the new check-out date
                },
                check_out_date: {
                  [Op.gt]: data.check_out_date, // Existing booking ends after the new check-out date
                }
              }
            ]
          }
        ]
      },
      transaction
    });
      
    let room = await Rooms.findOne({
      where: {
        id: data.room_id
      },
      transaction
    })

    if(bookingRoom){
      
      if (transaction) await transaction.rollback();
      return (`Room is already booked for the selected dates`);
    } 

    const checkInDate = new Date(data.check_in_date).setHours(0, 0, 0, 0); // Normalize time to midnight
    const checkOutDate = new Date(data.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
  
    // Calculate the difference in days
    let booked_days_no = (checkOutDate - checkInDate) / 86400000;
  
    if (booked_days_no > 0) {
      booked_days_no = booked_days_no
        
    }else{
      booked_days_no = 1
    }
    
    let amount_paid = 0;
    if(data.payment_status == 'Part Payment'){
      amount_paid = data.part_payment_amount;
    }else if(data.payment_status == 'Credit'){
      amount_paid = 0
    }
    else{
      // room.discount != null && room.discount < roomData.price ? roomData.price - room.discount : roomData.price ;
      amount_paid = data.discount != null && data.discount < room.price ? ((room.price * booked_days_no) - data.discount) :  room.price * booked_days_no
    }
    // 2. Create Booking
    const booking = await Booking.create(
      {
        customer_id: customer.id,
        booking_reference: booking_reference,
        booked_by: `${user.first_name} ${user.last_name}`,
        last_updated_by: `${user.first_name} ${user.last_name}`,
        payment_mode: data.payment_mode,
        payment_status: data.payment_status,
        check_in_date: data.check_in_date,
        check_in_time: data.check_in_time,
        check_out_date: data.check_out_date,
        status: data.check_in_status,
        price: room.price,
        booked_days_no,
        no_persons: data.no_persons,
        discount: data.discount == '' ? 0  : data.discount,
        amount_paid,
        room_id: room.id

        
      },
      { transaction }
    );

    if(data.payment_status == 'Part Payment'){
      //create  a booking transaction table 
      const todaysDate = new Date();
      const formattedDate = todaysDate.toISOString().split('T')[0];

      await BookingTransactions.create(
        {
          booking_id: booking.id,
          description: "Booking Part Payment",
          payment_mode: data.payment_mode,
          amount: data.part_payment_amount,
          date: formattedDate,
          employee_id: `${user.first_name} ${user.last_name}`,
         
        },
        { transaction }
      );

    }
    // else if(data.payment_status == 'Credit'){
    //   amount_paid = 0
    // }
    // else if(data.payment_status == 'Full Payment'){
    //   amount_paid = data.discount != null && data.discount < room.price ? ((room.price * booked_days_no) - data.discount) :  room.price * booked_days_no
    // }
    // Commit transaction

    
    //update room status
    await Rooms.update(
      { status: true },
      { where: { id: booking.room_id } })
    await transaction.commit();
    console.log(booking)
    return booking; // Return booking details
  } catch (error) {
    console.log(error)
    if (transaction) await transaction.rollback();
    throw error; // Propagate error
  }

}

static async bookRoomForCustomer(data){
  const { user } = data;
  console.log(data)
  const booking_reference =  'BR-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  console.log(booking_reference)
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    // 1. Create Customer
    const customer = await Customer.findOne(
      {
        where:{
          id: data.customer_id
        }
      },
      { transaction }
    );

    //check if the room is booked for the those selected dates
    const overlappingBookings = await Booking.findAll({
      where: {
        // room_id: { [Op.ne]: roomId }, // Exclude the room with the specified roomId
        room_id:  data.room_id , // Exclude the room with the specified roomId
        status: { [Op.in]: ['checkedin', 'pending'] },
        [Op.or]: [
          {
            check_in_date: { [Op.between]: [data.check_in_date, data.check_out_date] }
          },
          {
            check_out_date: { [Op.between]: [data.check_in_date, data.check_out_date] }
          },
          {
            [Op.and]: [
              { check_in_date: { [Op.lte]: data.check_in_date } },
              { check_out_date: { [Op.gte]: data.check_out_date } }
            ]
          }
        ]
      }
    });
  
      
    let room = await Rooms.findOne({
      where: {
        id: data.room_id
      },
      transaction
    })

    if (overlappingBookings.length > 0){ 
      
      if (transaction) await transaction.rollback();
      return (`Room is already booked for the selected dates`);
    } 

    const checkInDate = new Date(data.check_in_date).setHours(0, 0, 0, 0); // Normalize time to midnight
    const checkOutDate = new Date(data.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
  
    // Calculate the difference in days
    let booked_days_no = (checkOutDate - checkInDate) / 86400000;
  
    if (booked_days_no > 0) {
      booked_days_no = booked_days_no
        
    }else{
      booked_days_no = 1
    }
    
    let amount_paid = 0;
    if(data.payment_status == 'Part Payment'){
      amount_paid = data.part_payment_amount;
    }else if(data.payment_status == 'Credit'){
      amount_paid = 0
    }
    else{
      // room.discount != null && room.discount < roomData.price ? roomData.price - room.discount : roomData.price ;
      amount_paid = data.discount != null && data.discount < room.price ? ((room.price * booked_days_no) - data.discount) :  room.price * booked_days_no
    }
    // 2. Create Booking
    const booking = await Booking.create(
      {
        customer_id: customer.id,
        booking_reference: booking_reference,
        booked_by: `${user.first_name} ${user.last_name}`,
        last_updated_by: `${user.first_name} ${user.last_name}`,
        payment_mode: data.payment_mode,
        payment_status: data.payment_status,
        check_in_date: data.check_in_date,
        check_in_time: data.check_in_time,
        check_out_date: data.check_out_date,
        status: data.check_in_status,
        price: room.price,
        booked_days_no,
        no_persons: data.no_persons,
        discount: data.discount == '' ? 0  : data.discount,
        amount_paid,
        room_id: room.id

        
      },
      { transaction }
    );

    if(data.payment_status == 'Part Payment'){
      //create  a booking transaction table 
      const todaysDate = new Date();
      const formattedDate = todaysDate.toISOString().split('T')[0];

      await BookingTransactions.create(
        {
          booking_id: booking.id,
          description: "Booking Part Payment",
          payment_mode: data.payment_mode,
          amount: data.part_payment_amount,
          date: formattedDate,
          employee_id: `${user.first_name} ${user.last_name}`,
         
        },
        { transaction }
      );

    }
    // else if(data.payment_status == 'Credit'){
    //   amount_paid = 0
    // }
    // else if(data.payment_status == 'Full Payment'){
    //   amount_paid = data.discount != null && data.discount < room.price ? ((room.price * booked_days_no) - data.discount) :  room.price * booked_days_no
    // }
    // Commit transaction

    
    //update room status to occupied
    await Rooms.update(
      { status: true },
      { where: { id: booking.room_id } })

    await transaction.commit();
    console.log(booking)
    return booking; // Return booking details
  } catch (error) {
    console.log(error)
    if (transaction) await transaction.rollback();
    throw error; // Propagate error
  }

}

static async addRoomToBooking(data){
  const { user } = data;

  const transaction = await sequelize.transaction(); // Start transaction
  try {
    // 1. Create Customer

    //find booking
    const booking = await Booking.findOne({
      include: {
        model: Customer,
      },
      where:{
        id: data.booking_id
      },
      transaction
    })
    if(!booking){
      
      if (transaction) await transaction.rollback();
      return (`Booking Record Does Not Exist!`);
    } 
    //check if the room is booked for the those selected dates
    const overlappingBookings = await Booking.findAll({
      where: {
        // room_id: { [Op.ne]: roomId }, // Exclude the room with the specified roomId
        room_id:  data.room_id , // Exclude the room with the specified roomId
        status: { [Op.in]: ['checkedin', 'pending'] },
        [Op.or]: [
          {
            check_in_date: { [Op.between]: [data.check_in_date, data.check_out_date] }
          },
          {
            check_out_date: { [Op.between]: [data.check_in_date, data.check_out_date] }
          },
          {
            [Op.and]: [
              { check_in_date: { [Op.lte]: data.check_in_date } },
              { check_out_date: { [Op.gte]: data.check_out_date } }
            ]
          }
        ]
      }
    });
  
    if (overlappingBookings.length > 0){ 
      
      if (transaction) await transaction.rollback();
      return (`Room is already booked for the selected dates`);
    } 
 

    let room = await Rooms.findOne({
      where: {
        id: data.room_id
      },
      transaction
    })

 

    const checkInDate = new Date(data.check_in_date).setHours(0, 0, 0, 0); // Normalize time to midnight
    const checkOutDate = new Date(data.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
  
    // Calculate the difference in days
    let booked_days_no = (checkOutDate - checkInDate) / 86400000;
  
    if (booked_days_no > 0) {
      booked_days_no = booked_days_no
        
    }else{
      booked_days_no = 1
    }
    
    let amount_paid = 0;
    if(data.payment_status == 'Part Payment'){
      amount_paid = data.part_payment_amount;
    }else if(data.payment_status == 'Credit'){
      amount_paid = 0
    }
    else{
      // room.discount != null && room.discount < roomData.price ? roomData.price - room.discount : roomData.price ;
      amount_paid = data.discount != null && data.discount < room.price ? ((room.price * booked_days_no) - data.discount) :  room.price * booked_days_no
    }
    // 2. Create Booking
    const newbooking = await Booking.create(
      {
        customer_id: booking.Customer.id,
        booking_reference: booking.booking_reference,
        booked_by: `${user.first_name} ${user.last_name}`,
        last_updated_by: `${user.first_name} ${user.last_name}`,
        payment_mode: data.payment_mode,
        payment_status: data.payment_status,
        check_in_date: data.check_in_date,
        check_in_time: data.check_in_time,
        check_out_date: data.check_in_date,
        status: data.check_in_status,
        price: room.price,
        booked_days_no,
        no_persons: data.no_persons,
        discount: data.discount == '' ? 0  : data.discount,
        amount_paid,
        room_id: room.id

        
      },
      { transaction }
    );

    if(data.payment_status == 'Part Payment'){
      //create  a booking transaction table 
      const todaysDate = new Date();
      const formattedDate = todaysDate.toISOString().split('T')[0];

      await BookingTransactions.create(
        {
          booking_id: newbooking.id,
          description: "Booking Part Payment",
          payment_mode: data.payment_mode,
          amount: data.part_payment_amount,
          date: formattedDate,
          employee_id: `${user.first_name} ${user.last_name}`,
         
        },
        { transaction }
      );

    }

   
    //update room status to occupied
    await Rooms.update(
      { status: true },
      { where: { id: room.id } })

    // Commit transaction
    await transaction.commit();
   
    return newbooking; // Return booking details
  } catch (error) {
    console.log(error)
    if (transaction) await transaction.rollback();
    throw error; // Propagate error
  }

}

static async updateBooking(data) {
  const { formData, rooms, bookedRooms, id, user } = data;
  const transaction = await sequelize.transaction(); // Start transaction

  try {
    // Update Customer details if formData is provided
    if (formData) {
      await Customer.update(
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          nationality: formData.nationality,
          id_type: formData.id_type,
          id_number: formData.id_number,
          id_issue_country: formData.id_issue_country,
          id_exp_date: formData.id_exp_date,
          occupation: formData.occupation,
          bus_type: formData.bus_type,
          last_country_entry_date: formData.last_country_entry_date,
        },
        { where: { id: formData.customer_id }, transaction }
      );
    }

    // Fetch and validate booking
    const booking = await Booking.findByPk(id, { transaction });
    if (!booking) throw new Error("Booking not found");

    // Determine booking status based on rooms and bookedRooms
    const hasCheckedInRoom =
      rooms.some((room) => room.status === "checkedin") ||
      bookedRooms.some(
        (bookedRoom) => bookedRoom.bookingRoom_status === "checkedin"
      );
    const bookingStatus = hasCheckedInRoom ? "checkedin" : formData.booking_status;

    // Update booking details
    await booking.update(
      {
       // check_in_time: formData.booking_check_in_time,
        booked_by: `${user.first_name} ${user.last_name}`,
        status: bookingStatus,
        payment_mode: formData.payment_mode,
      },
      { transaction }
    );

    // Check for duplicate room IDs and overlapping dates
    if (rooms && rooms.length > 0) {
      const roomIds = rooms.map((room) => room.room_id);
      const duplicateRooms = roomIds.filter(
        (id, index) => roomIds.indexOf(id) !== index
      );

      if (duplicateRooms.length > 0) {
        const overlappingRooms = [];
        const groupedRooms = rooms.reduce((acc, room) => {
          acc[room.room_id] = acc[room.room_id] || [];
          acc[room.room_id].push({
            checkIn: new Date(room.check_in_date).setHours(0, 0, 0, 0),
            checkOut: new Date(room.check_out_date).setHours(0, 0, 0, 0),
          });
          return acc;
        }, {});

        Object.keys(groupedRooms).forEach((roomId) => {
          const dates = groupedRooms[roomId];
          for (let i = 0; i < dates.length; i++) {
            for (let j = i + 1; j < dates.length; j++) {
              const range1 = dates[i];
              const range2 = dates[j];
              if (
                range1.checkIn < range2.checkOut &&
                range2.checkIn < range1.checkOut
              ) {
                overlappingRooms.push(roomId);
                break;
              }
            }
          }
        });

        if (overlappingRooms.length > 0) {
          await transaction.rollback();
          return `Selected dates overlaps for the selected room`;
        }
      }

      // Update room statuses for newly added rooms
      await Rooms.update(
        { status: false },
        { where: { id: roomIds }, transaction }
      );
    }

    // Update existing booked rooms
    
    let totalPrice = 0;
    let latestCheckOutDate = null;
    //update existing rooms
    if (bookedRooms && bookedRooms.length > 0) {
      for (const bookedRoom of bookedRooms) {
        let roomInfo = await Rooms.findOne({
          where:{
            id: bookedRoom.bookingRoom_room_id
          },
          transaction
        })

        const checkInDate = new Date(
          bookedRoom.bookingRoom_check_in_date
        ).setHours(0, 0, 0, 0);
        const checkOutDate = new Date(
          bookedRoom.bookingRoom_check_out_date
        ).setHours(0, 0, 0, 0);
        let bookedDaysNo = (checkOutDate - checkInDate) / 86400000;
        if(bookedDaysNo <= 0){
          bookedDaysNo = 1;
        }
        const pricePerRoom = bookedRoom.bookingRoom_discount != null && bookedRoom.bookingRoom_discount < roomInfo.price * bookedDaysNo
         ? ((roomInfo.price * bookedDaysNo) - bookedRoom.bookingRoom_discount) : roomInfo.price * bookedDaysNo ;
        // Calculate the difference in days
        totalPrice += pricePerRoom
        await Booking.update(
          {
            check_in_time: bookedRoom.bookingRoom_check_in_time,
            check_out_date: bookedRoom.bookingRoom_check_out_date,
            check_out_time:
            bookedRoom.bookingRoom_check_out_time || null,
            booked_days_no: bookedDaysNo,
            no_persons: bookedRoom.bookingRoom_no_persons,
            status: bookedRoom.bookingRoom_status,
            price: pricePerRoom,
            discount: bookedRoom.bookingRoom_discount == '' ? 0  : bookedRoom.bookingRoom_discount
            
          },
          { where: { id: bookedRoom.bookingRoom_id }, transaction }
        );
      }

      // Update room statuses for checked-out booked rooms
      const checkedOutBookingRoomIds = bookedRooms
        .filter(
          (bookedRoom) => bookedRoom.bookingRoom_status === "checkedout"
        )
        .map((bookedRoom) => bookedRoom.bookingRoom_room_id);
      
        if(checkedOutBookingRoomIds.length > 0){
   
          await Booking.update(
            { status: "checkedout" },
            { where: { id: booking.id }, transaction }
          );
          await Rooms.update(
            { status: true },
            { where: { id: checkedOutBookingRoomIds }, transaction }
          );
        }
   
 
      
   
    }

    // Add new booking rooms and calculate total price
    if (rooms && rooms.length > 0) {
      for (const room of rooms) {
        console.log(room)
        const roomData = await Rooms.findOne({
          where: { id: room.room_id },
          transaction,
        });

      // Validate room availability
      const bookingRoomData = await Booking.findOne({
        where: {
          [Op.and]: [
            { room_id: room.room_id }, // Ensure the check is for the specific room
            { status: { [Op.ne]: "checkedout" } }, // Exclude 'checkedout' status
            {
              [Op.or]: [
                {
                  check_in_date: {
                    [Op.lt]: room.check_in_date, // Existing booking starts before the new check-in date
                  },
                  check_out_date: {
                    [Op.gt]: room.check_in_date, // Existing booking ends after the new check-in date
                  },
                },
                {
                  check_in_date: {
                    [Op.lt]: room.check_out_date, // Existing booking starts before or on the new check-out date
                  },
                  check_out_date: {
                    [Op.gt]: room.check_out_date, // Existing booking ends after or on the new check-out date
                  },
                },
              ],
            },
          ],
        },
        transaction,
      });


        if (bookingRoomData) {
          await transaction.rollback();
          return `Room ${roomData.number} is already booked for the selected dates`;
        }

      

        const checkInDate = new Date(room.check_in_date).setHours(0, 0, 0, 0);
        const checkOutDate = new Date(room.check_out_date).setHours(0, 0, 0, 0);
        let bookedDaysNo = (checkOutDate - checkInDate) / 86400000;
        if(bookedDaysNo <= 0){
          bookedDaysNo = 1;
        }
        const roomPrice = room.discount && room.discount < roomData.price * bookedDaysNo
        ? (roomData.price * bookedDaysNo)  - room.discount
        : roomData.price * bookedDaysNo;
        totalPrice += roomPrice
        await Booking.create(
          {
            booking_id: id,
            room_id: room.room_id,
            check_in_date: room.check_in_date,
            check_in_time: room.check_in_time,
            booked_days_no: bookedDaysNo,
            no_persons: room.no_persons,
            price: roomPrice,
            status: room.status,
            discount: room.discount == '' ? 0  : room.discount,
          },
          { transaction }
        );
        
        latestCheckOutDate =
          !latestCheckOutDate || checkOutDate > latestCheckOutDate
            ? checkOutDate
            : latestCheckOutDate;
      }
    }

    // Determine the latest checkout date from all sources
    const bookedRoomCheckOutDates = bookedRooms.map((room) =>
      new Date(room.bookingRoom_check_out_date).getTime()
    );
    const latestCheckOut = Math.max(
      latestCheckOutDate || 0,
      ...bookedRoomCheckOutDates
    );
    booking.check_out_date = new Date(latestCheckOut).toISOString().split("T")[0];
    

    // Update booking with the total price
    booking.total_price = totalPrice;
    await booking.save({ transaction });

    // Commit transaction
    await transaction.commit();

    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

static async addBookingAddon(data) {
    // add booking addon details 
      const bookingAddon =  await BookingAddon.create(
          {
            booking_room_id: data.formData.bookingRoom_id,
            addon_id: data.formData.addon_id,
            price: data.formData.addon_price,
            added_by: `${data.user.first_name} ${data.user.last_name}`,
            payment_mode: data.formData.addon_payment_mode
          },

        );
           
    return bookingAddon;

}

static async deleteBooking(bookingId) {
  // Start transaction for atomic operations
  const transaction = await sequelize.transaction();
  try {
    //find and destroy customer
    const booking = await Booking.findOne({
      where:{
        id: bookingId
      },
      transaction
    })
    // await Customer.destroy({
    //   where: { id: booking.customer_id },
    //   transaction
    // });
    // Find all booking rooms related to the booking ID
    // const bookingRooms = await Booking.findAll({
    //   where: { booking_id: bookingId },
    //   transaction
    // });

    // Extract booking room IDs
    // const bookingRoomIds = bookingRooms.map(room => room.id);

    // Delete all related booking addons linked to these booking rooms
    if (booking) {
      await BookingAddon.destroy({
        where: {
          booking_id: booking.id
        },
        transaction
      });
    }
    //update room status to not occupied
    await Rooms.update(
      { status: false },
      { where: { id: booking.id } })
      
    // Finally, delete the booking itself
    await Booking.destroy({
      where: { id: bookingId },
      transaction
    });

    // Commit the transaction

    await transaction.commit();
  } catch (error) {
    // Rollback transaction if any operation fails
    await transaction.rollback();
    throw error;
  }
}


//CUSTOMERS LOGIC
static async countCustomers(){
  const customerCount = await Customer.count({
  
  })
  return customerCount
}

static async getAllCustomers(page = 1, limit = 10) {
    // Calculate offset for pagination
    const offset = limit * (page - 1);

    // Raw SQL query for customers with total bookings and amount spent
    const rawQuery = `
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.email,
        c.address,
        c.id_type,
        c.id_number,
        c.id_exp_date,
        c.id_issue_country,
        c.occupation,
        c.nationality,
        c.last_country_entry_date,
        c.car_no,
        c.bus_type,
        c.createdAt,
        c.updatedAt,
        COUNT(b.id) AS totalBookings,
        IFNULL(SUM(b.price * b.booked_days_no), 0) AS totalAmountSpent
      FROM 
        Customers AS c
      LEFT JOIN 
        Bookings AS b
      ON 
        c.id = b.customer_id
      GROUP BY 
        c.id
      ORDER BY 
        c.createdAt DESC
      LIMIT :limit OFFSET :offset;
    `;

    // Execute the raw query
    const customers = await sequelize.query(rawQuery, {
      replacements: { limit, offset },
      type: sequelize.QueryTypes.SELECT,
    });

    return customers;
  
}

static async addCustomer(formData){
  const customer = await Customer.create(
    {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      nationality: formData.nationality,
      id_type: formData.id_type,
      id_number: formData.id_number,
      id_issue_country: formData.id_issue_country,
      id_exp_date: formData.id_exp_date,
      occupation: formData.occupation,
      bus_type: formData.bus_type,
      last_country_entry_date: formData.last_country_entry_date,
    });

return customer;

}
static async deleteCustomer(id){
  await Customer.destroy({
    where:{
      id: id
    }
  });
 }
// COMPLAINT LOGIC
static async countComplaints(){
  const complaintCount = await Complaints.count({
  
  })
  return complaintCount
}

static async countPendingComplaints(){
  const complaintCount = await Complaints.count({
    where:{
      status: {
        [Op.in]: ['pending', 'processing'], // Check for multiple statuses
      }
    }
  })
  return complaintCount
}

static async getAllComplaints(page, limit){
  let offset = 0;
  if(page == null){
       page = 1; 
  }
   // page number
  offset = limit * (page - 1);
  const complaint = await Complaints.findAll({
    offset,
    limit,
    order: [['createdAt', 'DESC']] // Order by most recent
  });
  return complaint
}

static async addComplaint(data){
  const complaint = await Complaints.create({ 
    room_number: data.room_number,
    room_id: data.room_id,
    title: data.title,
    message: data.message,
    status: "pending",
    
  });
return complaint;

}
static async getSingleComplaint(complaintId){
  const complaint = await Complaints.findOne({
    where:{
      id: complaintId
    }
  });
  return complaint
}

static async updateSingleComplaint(data){
  const complaint = await Complaints.update({
    room_number: data.room_number,
    room_id: data.room_id,
    title: data.title,
    message: data.message,
    status: data.status,
  
  },{
    where:{
      id: data.id
    }
  })
}

static async deleteComplaint(complaintId){
  await Complaints.destroy({
    where:{
      id: complaintId
    }
  });
 }
}

module.exports = AdminService