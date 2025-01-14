const AdminService = require("../services/admin.service")
const cloudinary = require('cloudinary').v2;
const axios = require('axios')
const {HashPassword} = require('../utils/auth');
const { welcomeEmailNotification } = require("../utils/welcome-email");
const employees = require("../models/employee");

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
  });
module.exports = {

    getStates: async(req, res, next)=>{
        try{
            const apiUrl = 'https://countriesnow.space/api/v0.1/countries/states'; 
            const response = await axios.post(apiUrl, req.body)
            const states = response.data.data.states;
            res.send(states)
        }catch(error){
            console.error('Error:', error);
        }
},

getQuote: async(req, res, next)=>{
  try{
    const response = await axios.get('https://zenquotes.io/api/random');
    res.json(response.data);
  }catch(error){
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
},
    getDashboard: async(req, res)=>{
        const limit = 10
        const page = req.query.page || 1
        const bookings = await AdminService.getAllBookings(page, limit)
        const rooms = await AdminService.getActivePaginatedRooms(page, limit)
        const todaybooking = await AdminService.CountTodayBookings()
        const weekbooking = await AdminService.CountThisWeeksBookings()
        const availableRoom = await AdminService.availableRoomCount()
        const bookedRoom = await AdminService.bookedRoomCount()
        const employeeCount = await AdminService.countEmployee()
        const complaintCount = await AdminService.countComplaints()
        const complaints = await AdminService.getAllComplaints(page, limit)
        
        res.render('index', {user: req.session.user, bookings, rooms, todaybooking,
          weekbooking, availableRoom, bookedRoom, employeeCount, complaintCount, complaints
        })
    },
    getRoleList: async(req, res)=>{
        const limit = 10
        const page = req.query.page || 1
        const roleCount = await AdminService.countRoles()
        let totalPages = Math.ceil(roleCount / limit);
        let currentPage = page
        const roles = await AdminService.getAllRolesWithPermissions(page, limit)
        const pages = await AdminService.getAllPages()

        res.render('roles/index', 
          {
            roles,
            pages,
            totalPages,
            currentPage,
            roleCount,
            user: req.session.user
          })
    },
    addRolesPage: async(req, res)=>{
      const pages = await AdminService.getAllPages()
        res.render('roles/add', {pages, user: req.session.user})
    },
    addRole: async(req, res)=>{
        try {
            const { roleName, permissions } = req.body;
          
            const role = await AdminService.createRoleWithPermissions(roleName, permissions);
            res.status(201).json({ message: 'Role created!', role });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong!' });
          }
    },
    getRoleEditPage: async(req, res)=>{
        let roleId = req.params.id;
        const role = await AdminService.getSingleRoleWithPermissions(roleId)
        if (!role) {
            return res.status(404).send('Role not found');
          }
        const pages = await AdminService.getAllPages()
        res.render('roles/edit', {role, pages, user: req.session.user})
    },
    
    updateRoleById: async(req, res)=>{
        const { roleName, permissions } = req.body;
        const roleId = req.params.id;

        try {
          const role = await AdminService.updateRole(roleId, roleName, permissions);
          res.redirect('/roles')
        //   res.status(200).json({ message: 'Role updated successfully!', role });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong!' });
        }
    },
    
    deleteRole: async(req, res)=>{

        const roleId = req.params.id;
      
        try {
          const role = await AdminService.deleteRole(roleId);
          res.redirect('/roles')
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong!' });
        }
    },
    


    // Employees LOGIC

    getEmployeeList: async(req, res)=>{
        const limit = 10
        const page = req.query.page || 1
        const employeeCount = await AdminService.countEmployee()
        let totalPages = Math.ceil(employeeCount / limit);
        let currentPage = page
        
        const employees = await AdminService.getAllEmployeesWithRole(page, limit)
        //get all roles
        const roles = await AdminService.countEmployeeByRole()
       
        res.render('employees/index', 
          {
            employees,
            totalPages,
            currentPage,
            employeeCount,
            roles,
            user: req.session.user
          })
    },
    getaddEmployeePage: async(req, res)=>{
        //fetch roles and display
        const roles = await AdminService.fetchRoles();
      
        //call countries api
        const countries = await getCountries();
         //call bank list api
        const banks = await getBanks();
  
        res.render('employees/add', {roles, countries, banks, user: req.session.user})
    },

    addEmployee: async(req, res)=>{
        try {
         
            const data = req.body
            const file = req.file;
            const plainPassword = data.password
            if(file){
                var imageUrl = await uploadSingleFilesToCloudinary(file);
                data['profile_pic'] = imageUrl;
            }
     
            if(data.password){
              let userPassword = await HashPassword(data.password)
              data.password = userPassword
             }
             

            const employee = await AdminService.addEmployee(data);
            console.log(plainPassword)
            if(employee){
              let emaildata = {
                  username: employee.dataValues.first_name,
                  email: employee.dataValues.email,
                  password: plainPassword,
                  title: "Welcome to the New Eastern Comfort Hotel"
                }
                welcomeEmailNotification(emaildata, (err, resp)=>{
                  if(err) return
                    return
                  })
         
              }
            res.redirect('/employees')
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong!' });
          }
    },
    updateEmployeeStatus: async(req, res)=>{
        try {
          
            const data = req.body
            data.id = req.params.id
            const employee = await AdminService.updateEmployeeStatus(data);
          
            if(employee){
               return res.status(201).json({ message: 'Update Successful' });
            }
            return res.status(404).json({ error: 'Something went wrong!' });
    
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong!' });
          }
    },

    getEmployeeEditPage: async(req, res)=>{
        let employeeId = req.params.id;
        //fetch roles and display
        const roles = await AdminService.fetchRoles();
      
        //call countries api
        const countries = await getCountries();
        //call bank list api
        const banks = await getBanks();
        const employee = await AdminService.getSingleEmployee(employeeId)
        if (!employee) {
            return res.status(404).send('Role not found');
          }
        res.render('employees/edit', {roles, countries, employee,banks, user: req.session.user})
    },
    
    updateEmployeeById: async(req, res)=>{
        try {
            const data = req.body
            data.id = req.params.id;
                const file = req.file;

                if(file){
                    //delete existing file
                    const employee = await AdminService.getSingleEmployee(data.id);
                    if(employee && employee.profile_pic){
                        await deleteSingleFileInCloudinary(employee.profile_pic)
                    }
                    
                    var imageUrl = await uploadSingleFilesToCloudinary(file);
                    data['profile_pic'] = imageUrl;
                }
            
      
  
            const employee = await AdminService.updateSingleEmployee(data);
            res.redirect('/employees')
            //   res.status(200).json({ message: 'Role updated successfully!', role });
            } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong!' });
        }
    },

    deleteEmployee: async(req, res)=>{

        const employeeId = req.params.id;
      
          //delete existing file
          const employee = await AdminService.getSingleEmployee(employeeId);
          if(employee && employee.profile_pic){
              await deleteSingleFileInCloudinary(employee.profile_pic)
          }
          
        try {
          const role = await AdminService.deleteEmployee(employeeId);
          res.redirect('/employees')
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong!' });
        }
    },

    // ADDON/SUBADDON LOGIC


    getAddonList: async(req, res)=>{
        const limit = 5
        const page = req.query.page || 1
        const addonCount = await AdminService.countAddon()
        let totalPages = Math.ceil(addonCount / limit);
        let currentPage = page
        const addons = await AdminService.getAllAddons(page, limit)
      
        res.render('addons/index', 
          {
            addons,
            totalPages,
            currentPage,
            user: req.session.user
          })
    },

    addAddons: async(req, res)=>{
        try {
         
            const data = req.body
            const file = req.file;

            if(file){
                var imageUrl = await uploadSingleFilesToCloudinary(file);
                data['image'] = imageUrl;
            }
           
            await AdminService.addAddon(data);
            res.redirect('/addons')
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong!' });
          }
    },


    getAddonEditPage: async(req, res)=>{
        let data = {};
        data.id = req.params.id;
        data.type = req.query.type;
        const limit = 10
        const page = req.query.page || 1
     
        const addons = await AdminService.getAllAddons(page)
        const addon = await AdminService.getSingleAddon(data)
        res.render('addons/edit', {addons, addon, type: data.type, user: req.session.user})
    },
    
    updateAddonById: async(req, res)=>{
        try {
            const data = req.body
            data.id = req.params.id;
            const file = req.file;

                if(file){
                    //delete existing file
                    const addon = await AdminService.getSingleAddon(data);
                    if(addon && employee.image){
                        await deleteSingleFileInCloudinary(addon.image)
                    }
                    
                    var imageUrl = await uploadSingleFilesToCloudinary(file);
                    data['image'] = imageUrl;
                }
            
            const employee = await AdminService.updateSingleAddon(data);
           
            res.redirect('/addons')
         
            } catch (error) {
          console.error(error);
          res.redirect('/addons')
        }
    },

    deleteAddon: async(req, res)=>{

        const addonId = req.params.id;
        const type = req.query.type;
        try {
          await AdminService.deleteAddon(addonId, type);
          res.redirect('/addons')
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong!' });
        }
    },



    //ROOM LOGIC

    getAllRooms: async(req, res)=>{
        const limit = 10
        const page = req.query.page || 1
        const roomCount = await AdminService.countRooms()
        let totalPages = Math.ceil(roomCount / limit);
        let currentPage = page
        let availableRoomCount = await AdminService.availableRoomCount()
        const rooms = await AdminService.getAllRooms(page, limit)
      
        res.render('rooms/index', 
          {
            rooms,
            currentPage,
            totalPages,
            roomCount,
            availableRoomCount,
            user: req.session.user
          })
    },
    getAddRoomPage: async(req, res)=>{
        //fetch room types
        const roomTypes = await AdminService.getRoomTypes()
        res.render('rooms/add', {roomTypes, user: req.session.user})
    },

    addRoom: async(req, res)=>{
        try {
         
            const data = req.body
           
            await AdminService.addRoom(data);
            res.redirect('/rooms')
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong!' });
          }
    },

    updateRoomStatus: async(req, res)=>{
        try {
      
            const data = req.body
            data.id = req.params.id
          
            const room = await AdminService.updateRoomStatus(data);
          
            if(room){
               return res.status(201).json({ status: true, message: 'Update Successful' });
            }
            return res.status(201).json({ status: false, error: 'This romm is currently booked!' });
              
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong!' });
          }
    },

    getRoomEditPage: async(req, res)=>{
   
        const id = req.params.id;
        const room = await AdminService.getSingleRoom(id)
        const roomTypes = await AdminService.getRoomTypes()
    
        res.render('rooms/edit', {room, roomTypes, user: req.session.user})
    },
    
    updateRoomById: async(req, res)=>{
        try {
            const data = req.body
            data.id = req.params.id;
            
            const room = await AdminService.updateSingleRoom(data);
           
            res.redirect('/rooms')
         
            } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong!' });
        }
    },

    deleteRoom: async(req, res)=>{

        const roomId = req.params.id;
   
        try {
          await AdminService.deleteRoom(roomId);
          res.redirect('/rooms')
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Something went wrong!' });
        }
    },


    //BOOKING LOGIC
    getAllBookings: async(req, res)=>{
        const limit = 10
        const page = req.query.page || 1
        const bookingCount = await AdminService.CountBookings()
        let totalPages = Math.ceil(bookingCount / limit);
        let currentPage = page
        const bookings = await AdminService.getAllBookings(page, limit)
       
        res.render('booking/index', {
          bookings,
          totalPages,
          currentPage,
          bookingCount,
          user: req.session.user
        })
    },
    getAddBookingPage: async(req, res)=>{
        const rooms = await AdminService.getAllActiveRooms()
        const countries = await getCountries();
        res.render('booking/add', {rooms, countries, user: req.session.user})
    },

    addBooking: async(req, res)=>{
        try {
         
            const data = req.body
            data.user = req.session.user
            const booking = await AdminService.addBooking(data);
       
            if (typeof booking === 'string') {
              return res.status(500).json({ message: booking });
            }
            else{
              res.status(200).json({ message: 'Successful!', booking });
            }
            // res.redirect('/rooms')
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong!' });
          }
    },
    getSingleBooking: async(req, res)=>{
      try {
         
      const bookingId = req.params.id
    
      const booking = await AdminService.getSingleBooking(bookingId)
      const bookingRooms = await AdminService.getBookingRoom(bookingId)

      res.render('booking/view', {
        booking,
        bookingRooms,
        user: req.session.user
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  },

  getEditBooking: async(req, res)=>{
    try {
       
    const bookingId = req.params.id
    const booking = await AdminService.getSingleBooking(bookingId)
    const bookingRooms = await AdminService.getBookingRoom(bookingId)
    const rooms = await AdminService.getAllActiveRooms()

    const countries = await getCountries();
    res.render('booking/edit', {
      booking,
      bookingRooms,
      rooms,
      countries,
      user: req.session.user
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
},
  
updateBookingById: async(req, res)=>{
  try {
      const data = req.body
      data.id = req.params.id;
      data.user = req.session.user
      const booking = await AdminService.updateBooking(data);
  
      if (typeof booking === 'string') {
        return res.status(500).json({ message: booking });
      }
      else{
        res.status(200).json({ message: 'Successful!', booking });
      }
   
      } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
},
  deleteBooking: async(req, res)=>{

    const bookingId = req.params.id;

    try {
      await AdminService.deleteBooking(bookingId);
      res.redirect('/bookings')
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
},
  


//  COMPLAINT LOGIC


getAllComplaints: async(req, res)=>{
  const limit = 10
  const page = req.query.page || 1
  const totalComplaint = await AdminService.countComplaints()
  const availableComplaints = await AdminService.countPendingComplaints()
  let totalPages = Math.ceil(totalComplaint / limit);
  let currentPage = page
  const complaints = await AdminService.getAllComplaints(page, limit)

  res.render('complaint/index', 
    {
      complaints,
      currentPage,
      totalPages,
      totalComplaint,
      availableComplaints,
      user: req.session.user
    })
},
getAddComplaintPage: async(req, res)=>{
  const rooms = await AdminService.getAllUnpaginatedRooms()
  res.render('complaint/add', {user: req.session.user, rooms})
},

addComplaint: async(req, res)=>{
  try {
   
      const data = req.body
      await AdminService.addComplaint(data);
      res.redirect('/complaints')
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
},

getComplaintEditPage: async(req, res)=>{
   
  const id = req.params.id;
  const complaint = await AdminService.getSingleComplaint(id)

  const rooms = await AdminService.getAllUnpaginatedRooms()
  res.render('complaint/edit', {complaint, rooms, user: req.session.user})
},

    
updateComplaintById: async(req, res)=>{
  try {
      const data = req.body
      data.id = req.params.id;
  
      const complaint = await AdminService.updateSingleComplaint(data);
     
      res.redirect('/complaints')
   
      } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
},

deleteComplaint: async(req, res)=>{

  const complaintId = req.params.id;

  try {
    await AdminService.deleteComplaint(complaintId);
    res.redirect('/complaints')
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
},
}

const uploadSingleFilesToCloudinary= async file => {
    try {
    
    const video =   cloudinary.uploader.upload(file.path, { 
        folder: 'King Dunamis Sermons',
     }, (error, result) => {
        if (error) {
            console.error("Error Deleting file from cloudinary")
            console.error(error)
            
        } else {
            return result.secure_url
        }
    });
    return (await video).secure_url;
    } catch (error) {
        console.error("Error Deleting file from cloudinary")
        console.error(error)
        return
    }
}

const deleteSingleFileInCloudinary= async url => {
    try {
        const publicId = url.split('/').pop().replace(/\..+$/, '');

        cloudinary.uploader
            .destroy(`King Dunamis Sermons/${publicId}`, {resource_type: 'image', invalidate: true})
            .then(result => 
                console.log(result)
                    
            );
    } catch (error) {
        console.error("Error Deleting file from cloudinary")
        console.error(error)
       
    }
}
const getCountries = async()=>{
    try{
        const apiUrl = 'https://countriesnow.space/api/v0.1/countries/iso';

        const response = await axios.get(apiUrl)
        const countries = response.data.data;
        return countries
    }catch(error){
        console.error('Error:', error);  
    }
}

const getBanks = async()=>{
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
  try {
    const response = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });
    const banks = response.data.data;
    return banks
  } catch (error) {
    console.error('Error fetching banks:', error.message);
  }

}