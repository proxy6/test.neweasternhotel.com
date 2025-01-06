const { DATE } = require('sequelize');
const { Role, Permission, SubAddon, Addons, Rooms, Employee, Customer, Booking, BookingAddon, BookingRooms, RoomType, Pages } = require('../models');
// const Booking = require('../models/booking');
const { sequelize } = require('../models'); // Database connection
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
static async updateEmployeestatus(data){
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
    where:{
      email: email
    },
    include: {
      model: Role,
      as: 'Role',  // Ensure this matches your association alias
    },
  })
  return employee
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
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new Error('Employee not found');
 
 
  // Delete the Employee
  await Employee.destroy();
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
 
static async getAllRooms(page){
  const room = await Rooms.findAll({

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
static async getAllActiveRooms(){
  const room = await Rooms.findAll({
    where:{
      status: true
    }

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
  const bookingCount = await Booking.count({
    include: [
    
      {
        model: Customer
      },
      
    ],
  })
  return bookingCount

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
              // as: 'customer', // Assuming association alias is 'customer'
              // attributes: ['id', 'name', 'phone'] // Include specific fields
            },
            
          ],
          order: [['createdAt', 'DESC']] // Order by most recent
        });
  const bookingRooms = await BookingRooms.findAll({
      include:[
        {
          model: Rooms,
          // as: 'room', // Assuming association alias is 'room'
          // attributes: ['id', 'number', 'price'] // Include specific fields
      },
      {
        model: Booking,
        // as: 'booking', // Assuming association alias is 'room'
        // attributes: ['id', 'total_price'] // Include specific fields
      },
      ]
  })
  // console.log(booking)

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
  const { booking_reference, formData, rooms } = data;
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

      // Dynamically set the booking status based on room status
      const bookingStatus = hasCheckedInRoom ? 'checkedin' : 'pending'; // 'checkedin' if any room has the status

    const booking = await Booking.create(
      {
        customer_id: customer.id,
        booking_reference: booking_reference,
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

    if (duplicateRooms.length > 0) {
      if (transaction) await transaction.rollback(); // Rollback transaction if already started
      return (`${[...new Set(duplicateRooms)].join(', ')} Duplicate rooms found`);
    }
    // 3. Create Booking Rooms
    for (const room of rooms) {
      let roomData = await Rooms.findOne({
        where:{
          id: room.room_id
        },
        transaction
      })

      if(roomData.status == false){
        console.log('got here')
        // if (transaction) await transaction.rollback();
        throw new Error('Room is unavailable!');
      }
      const pricePerDay = roomData.price;

      const roomPrice = pricePerDay * parseInt(room.booked_days_no); // Calculate room price

      await BookingRooms.create(
        {
          booking_id: booking.id,
          room_id: room.room_id,
          check_in_date: room.check_in_date,
          check_in_time: room.check_in_time,
          booked_days_no: room.booked_days_no,
          no_persons: room.no_persons,
          price: roomPrice,
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
    console.log(booking)
    return booking; // Return booking details
  } catch (error) {
    console.log(error)
    if (transaction) await transaction.rollback();
    throw error; // Propagate error
  }

}

static async updateBooking(data) {
  const { formData, rooms, bookedRooms, id } = data;
  const transaction = await sequelize.transaction(); // Start transaction

  try {
    // 1. Update Customer details
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

    // 2. Update Booking details
    const booking = await Booking.findByPk(id, { transaction });
    if (!booking) throw new Error("Booking not found");
    console.log(booking)
    await booking.update(
      {
        check_in_time: formData.booking_check_in_time,
        status: formData.booking_status, // Update status if provided
      },
      { transaction }
    );

    if (rooms && rooms.length > 0) {
      // 3. Check for duplicate room IDs
      const roomIds = rooms.map(room => room.room_id); // Extract all room IDs

      const duplicateRooms = roomIds.filter((id, index) => roomIds.indexOf(id) !== index);

      if (duplicateRooms.length > 0) {
        if (transaction) await transaction.rollback(); // Rollback transaction if already started
        return (`${[...new Set(duplicateRooms)].join(', ')} Duplicate rooms found`);
      }

      // update room status for newly added rooms
      await Rooms.update(
        { status: false },
        { where: { id: roomIds }, transaction }
      );
    }

    // 4. Update Existing Booking Rooms
    if (bookedRooms && bookedRooms.length > 0) {
      for (const bookedRoom of bookedRooms) {
       await BookingRooms.update(
            {
      
              check_in_date:bookedRoom.bookingRoom_check_out_date,
              check_in_time:bookedRoom.bookingRoom_check_in_time,
              booked_days_no: bookedRoom.bookingRoom_no_days_booked,
              no_persons: bookedRoom.bookingRoom_no_persons,
              
              status: bookedRoom.bookingRoom_status
            },
            { where: { id: bookedRoom.bookingRoom_id }, transaction }
          );
        
      }

      // Filter bookedRooms with 'checkedout' status and extract their IDs
      const checkedOutBookingRoomIds = bookedRooms
      .filter(bookedRoom => bookedRoom.bookingRoom_status === 'checkedout') // Filter 'checkedout' status
      .map(bookedRoom => bookedRoom.bookingRoom_room_id); // Extract Room IDs

      console.log(checkedOutBookingRoomIds); // Debugging: Check filtered IDs
  
      //update room status for checked out rooms
      await Rooms.update(
        { status: true },
        { where: { id: checkedOutBookingRoomIds }, transaction }
      );
    
    }
    
    
    // 5. Add new Booking Rooms
    let totalPrice = booking.total_price;
    if (rooms && rooms.length > 0) {
      for (const room of rooms) {
        let roomData = await Rooms.findOne({
          where:{
            id: room.room_id
          }
        })

        console.log(roomData)
        
        if(roomData.status == false){
        
          if (transaction) await transaction.rollback();
          return ('Room is unavailable!');
        }
        const pricePerDay = roomData.price;

        const roomPrice = pricePerDay * parseInt(room.booked_days_no); // Calculate room price

          // Add new room
          await BookingRooms.create(
            {
              booking_id: id, //this is the booking id
              room_id: room.room_id,
              check_in_date: room.check_in_date,
              check_in_time: room.check_in_time,
              booked_days_no: room.booked_days_no,
              no_persons: room.no_persons,
              price: roomPrice,
              status: room.status,
            },
            { transaction }
          );
        
        totalPrice += roomPrice; // Update total price
      }
    }

    // 4. Update Booking with total price
    booking.total_price = totalPrice;
    if (bookedRooms && bookedRooms.length > 0) {
      // Check if all bookedRooms have bookingRoom_status === 'checkedout'
      const allCheckedOut = bookedRooms.every(
        bookedRoom => bookedRoom.bookingRoom_status === 'checkedout'
      );

      // If all rooms are checked out, update the booking status
      if (allCheckedOut) {
        booking.status = 'checkedout'; // Booking New status
        booking.check_out_date = new Date().toISOString().split('T')[0]
      }
    }

    await booking.save({ transaction });

    // Commit transaction
    await transaction.commit();
    console.log('saved booking')
    console.log(booking)
    return booking; // Return updated booking details
  } catch (error) {
    console.log(error)
    await transaction.rollback(); // Rollback on error
    throw error; // Propagate error
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



        
}
module.exports = AdminService