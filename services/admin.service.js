const { DATE } = require('sequelize');
const { Role, Permission, SubAddon, Addons, Rooms, Employee, Customer, Booking, BookingAddon, BookingRooms, RoomType, Pages, Complaints } = require('../models');
// const Booking = require('../models/booking');
const { sequelize } = require('../models'); // Database connection
const { Op } = require('sequelize'); // Import Sequelize operators

const bookingRooms = require('../models/bookingRooms');


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
    include: {
      model: SubAddon,
      as: 'SubAddon' // Match the alias defined in the association
    },
  })
  return addonCount

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
    include: {
      model: SubAddon,
      as: 'SubAddon' // Match the alias defined in the association
    },
  });
  return addon
}

static async addAddon(data){

  if(data.parent_id != ''){
   
    const parentAddon = await Addons.findOne({
      where:{
        id: data.parent_id
      },
      include: {
        model: SubAddon,
        as: 'SubAddon', // Use the alias defined in association
      },
    })
    const subaddon = await SubAddon.create({ 
      name: data.name,
      desc: data.desc,
      price: data.price,
      status: data.status,
      image:  data['image'], 
      addon_id: parentAddon.id
    });
   

    return parentAddon
  }
  const addon = await Addons.create({ 
    name: data.name,
    desc: data.desc,
    price: data.price,
    status: data.status,
    image:  data['image'], 
    
  });
return addon;

}
static async getSingleAddon(data){
  if (data.type === 'addon') {
    const addon = await Addons.findOne({
      where:{
        id: data.id
      },
      include: {
        model: SubAddon,
        as: 'SubAddon',  // Ensure this matches your association alias
      },
    })
    return addon
  }else if(data.type === 'subaddon') {
    const subaddon = await SubAddon.findOne({
      where:{
        id: data.id
      }
    });
    return subaddon
  }
}
static async updateSingleAddon(data){
  //this is a subaddon that is still a subaddon
  if(data.type == 'subaddon' && data.parent_id != ''){
   

    await SubAddon.update({ 
      name: data.name,
      desc: data.desc,
      price: data.price,
      status: data.status,
      image:  data['image'], 
      addon_id: data.parent_id
    },
    {
      where:{
        id: data.id
      }
    }
  );
   
  }else if(data.type == 'subaddon' && data.parent_id == ''){ //this is a subaddon that switched to an addon
    //add addon
    const addon = await Addons.create({ 
      name: data.name,
      desc: data.desc,
      price: data.price,
      status: data.status,
      image:  data['image'], 
      
    });
    //delete subaddon
    let sub = await SubAddon.destroy({
      where:{
        id: data.id
      }
    })

    
  }else if(data.type == 'addon' && data.parent_id != ''){   //this is a addon that switched to a subaddon
    if(data.parent_id != data.id){ // you can't switch an addon to be its own subaddon
    //create a subaddon
    await SubAddon.create({
      name: data.name,
      desc: data.desc,
      price: data.price,
      status: data.status,
      image:  data['image'],
      addon_id: data.parent_id
    })
    //delete current addon 
    await Addons.destroy({
      where:{
        id: data.id
      }
    })
  }
  }else{ //update addon that is still an addon
  const addon = await Addons.update({ 
    name: data.name,
    desc: data.desc,
    price: data.price,
    status: data.status,
    image:  data['image'], 
    
  },
  {
    where:{
      id: data.id
    }
  });
  
}

}
static async deleteAddon(addonId, type){
//delete addon
if(type == 'addon'){
  await Addons.destroy({
    where:{
      id: addonId
    }
  })
}else if(type == 'subaddon'){
  await SubAddon.destroy({
    where:{
      id: addonId
    }
  });
 }
}



// ROOMS LOGIC
static async countRooms(){
  const roomCount = await Rooms.count({
    
  })
  return roomCount

}

static async availableRoomCount(){
  const roomCount = await Rooms.count({
    where:{
      status: true
    }

  })
  return roomCount

}

static async availableRoom(roomId, checkIn, checkOut){
  const overlappingBookings = await BookingRooms.findAll({
    where: {
      room_id: { [Op.ne]: roomId }, // Exclude the room with the specified roomId
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
  const roomCount = await BookingRooms.count({
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
    const booking  = await BookingRooms.findOne({
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
            
          ],
          order: [['createdAt', 'DESC']] // Order by most recent
        });
  const bookingRooms = await BookingRooms.findAll({
      include:[
        {
          model: Rooms,
        
      },
      {
        model: Booking,

      },
      ]
  })


  return {bookingRooms, booking}
}
static async getSingleBooking(bookingId){
  const booking = await Booking.findOne({
    include:[
      {
        model: Customer,
    },
  ],
    where:{
      id: bookingId
    },
    
  });
  return booking
}

static async getBookingRoom(bookingId){
  const booking = await BookingRooms.findAll({
    include:[
      {
        model: Rooms,
        // as: 'room', // Assuming association alias is 'room'
        // attributes: ['id', 'number', 'price'] // Include specific fields
    },
  ],
  
    where:{
      booking_id: bookingId
    },
    
  });
  return booking
}
static async addBooking(data){
  const { booking_reference, formData, rooms, user } = data;
  console.log(formData)
  console.log(rooms)
  console.log("CHECKING")
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
      let bookingRoomData = await BookingRooms.findOne({
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
      await BookingRooms.create(
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
        await BookingRooms.update(
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

      await Rooms.update(
        { status: true },
        { where: { id: checkedOutBookingRoomIds }, transaction }
      );
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
      const bookingRoomData = await BookingRooms.findOne({
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
        await BookingRooms.create(
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
    await Customer.destroy({
      where: { id: booking.customer_id },
      transaction
    });
    // Find all booking rooms related to the booking ID
    const bookingRooms = await BookingRooms.findAll({
      where: { booking_id: bookingId },
      transaction
    });

    // Extract booking room IDs
    const bookingRoomIds = bookingRooms.map(room => room.id);

    // Delete all related booking addons linked to these booking rooms
    if (bookingRoomIds.length > 0) {
      await BookingAddon.destroy({
        where: {
          booking_room_id: bookingRoomIds
        },
        transaction
      });
    }

    // Delete all booking rooms related to the booking ID
    await BookingRooms.destroy({
      where: { booking_id: bookingId },
      transaction
    });

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