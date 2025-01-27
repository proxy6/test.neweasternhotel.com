const {_} = require('lodash')
const UserService = require('../services/admin.service')
const {HashPassword, GenerateOtp, validatePassword, GenerateSignature} = require('../utils/auth')
const {otpEmailNotification} = require('../utils/otp-template')
const AdminService = require('../services/admin.service')
module.exports = {
  signinPage: async(req, res)=>{
        res.render('auth/login')
    },
    signIn: async(req, res)=>{
      try{
          
            const {password, email} = req.body
            const user = await AdminService.getSingleEmployeeByEmail(email)
            
            if(!user) return res.render('auth/login', { error: 'Email or Password is not correct'})
            const validatePass = await validatePassword({password, savedPassword: user.password})
            if(!validatePass){
                return res.render('auth/login', { error: 'Email or Password Incorrect'})
            }
            //redirect to change password page
            if(user.dataValues.confirm_email == false){ 
              req.session.email = email
              req.session.url = '/signin/verify'
              //resend otp email
              const otp = await GenerateOtp(email)
                // send otp notification
              let data = {
                username: user.dataValues.first_name,
                email,
                title: "Confirm your Email",
                message: otp
              }
              otpEmailNotification(data, (err, resp)=>{
              if(err) return
                return
              })
              //redirect to otp verification page
              return res.redirect('/signin/verify')
            
             
            }
          
            const access_token = await GenerateSignature({email: user.email, role: user.Role.name,
               permission: user.Role.Permissions, lastUpdated: user.updatedAt })
     
            const omitdata = _.omit(user.toJSON(), 
            ['id', 'password', 'otp', 'createdAt', 'updatedAt', 'status', 'country', 'state', 'city', 'address', 'account_name',
              'account_no', 'bank_name', 'referee_name', 'referee_phone', 'referee_address', 'confirm_email', 'role_id',
              'Role.createdAt', 'Role.updatedAt', 'Role.id'
             ])
            req.session.token = access_token;
            req.session.user = omitdata;  
            const redirectEndpoint = '/'
        
            // Clear the originalEndpoint from session
            // delete req.session.originalEndpoint;

    
             
            res.redirect(redirectEndpoint);
        }catch(e){
          console.log(e)
          console.log(e)
          res.render('backend/error-page-500', {error: 'Unable to Signin User'})
      }
    
    },

    unauthorizedPage: async(req, res)=>{
      res.render('unauthorized', {  user: req.session.user})
  },
    getVerifySigninPage: async (req, res)=>{
      try{
        // let email = 'testadmin@gmail.com'
        // let url = '/verify/otp'
 
        const {email, url} = req.session
   
        const maskedEmail = maskEmail(email);
        
        return res.render('auth/otp', {  email, message: `Please enter the 4 digit code sent to`, maskedEmail,  url}) 
        }catch(e){
          console.log(e)
          res.render('backend/error-page-500', { error: "Error occured while verifying user"})
        }
    },
    resendOtp: async(req, res)=>{
      try{
        // const {email} = req.body
        const {email, url} = req.session;
        const user = await AdminService.getSingleEmployeeByEmail(email)
        if(!user) return res.render('auth/otp', {error: "An error occured while trying to resend otp"})
        //resend otp email
        const otp = await GenerateOtp(email)
        // send otp notification
        let data = {
          username: user.dataValues.first_name,
          email,
          title: "Confirm your Email",
          message: otp
        }
        otpEmailNotification(data, (err, resp)=>{
        if(err) return
          return
        })
        const maskedEmail = maskEmail(email);
        // res.redirect('/signup/verify');
        // req.session.email = email
        return res.render('auth/otp', { message: `Otp has been resent to email ${maskedEmail}`, email, url, maskedEmail }) 
      }catch(e){
        console.log(e)
        res.render('backend/error-page-500', {error: "An Error Occured - Verification Failed"})
      }
    },

    
    verifySignin: async(req, res)=>{
      try{
        //get email from session
        let {email, url} = req.session
        let {otp} = req.body
        let request = {
          email: email,
          otp: otp
        }

        const validate = await AdminService.VerifyEmployee(request)
 
        if(!validate) 
        {
          const maskedEmail = maskEmail(email);
          req.session.email = email
  
          return res.render('auth/otp', { error: 'Email Verification Failed',  message: `Please enter the 4 digit code sent to`, email, url, maskedEmail}) 
        }
    
        res.redirect('/change-password')
    }catch(e){
        console.log(e)
        res.render('backend/error-page-500', { error: "Error occured while verifying user"})
    }
    },

    getChangePasswordPage: async(req, res)=>{
      res.render('auth/change-password')
  },
    completeSignIn: async(req, res)=>{
      try{
        const {password} = req.body
        let email = req.session.email
        console.log(req.session)
        if(!email) return res.render('auth/change-password', {error: "An error occured while changinging password. Try signing in instead"})
        const user = await AdminService.getSingleEmployeeByEmail(email)
        if(!user) return res.render('auth/change-password', { error: 'User does not exist'})

         //hash password
        let userPassword = await HashPassword(password)
        req.body.password = userPassword
        req.body.email = email
        const updateUser = await AdminService.updateEmployeePassword(req.body);
        console.log(updateUser)
        if(!updateUser) return res.render('auth/change-password', { error: 'Change Password Failed. Please try again'})
        const access_token = await GenerateSignature({email: user.email, role: user.Role.name})

        const omitdata = _.omit(user.toJSON(), 
        ['id', 'password', 'otp', 'createdAt', 'updatedAt', 'status', 'country', 'state', 'city', 'address', 'account_name',
          'account_no', 'bank_name', 'referee_name', 'referee_phone', 'referee_address', 'confirm_email', 'role_id',
          'Role.createdAt', 'Role.updatedAt', 'Role.id'
         ])
        req.session.token = access_token;
        req.session.user = omitdata;  
        const redirectEndpoint = req.session.originalEndpoint || '/';
        // Clear the originalEndpoint from session
        delete req.session.originalEndpoint;

             
        res.redirect(redirectEndpoint);
       
      }catch(ex){
        console.log(ex)
        res.render('backend/error-page-500', { error: 'Unable to Change Password'})
      }
    },
    getForgetPasswordPage: async(req, res)=>{
      
      res.render('auth/password-reset')
  },
  

  getVerifyPage: async (req, res)=>{
      try{
        const {email} = req.session
        res.render('verify-email', { error: 'Otp has been resent to email', email: email}) 
        }catch(e){
          console.log(e)
          res.render('backend/error-page-500', { error: "Error occured while verifying user"})
        }
    },
    verifyEmailOtp: async(req, res)=>{
      try{
        //get email from session
        req.body.email = req.session.email
        const validate = await UserService.VerifyUser(req.body)
        if(!validate) 
        {
          req.session.email = req.body.email

          return res.render('verify-email', { error: 'Email Verification Failed', email: req.body.email}) 
        }
        res.redirect('/dashboard')
    }catch(e){
        console.log(e)
        res.render('backend/error-page-500', { error: "Error occured while verifying user"})
    }
    },
    
 
    signup: async(req, res)=>{
        try{
          let {email, password} = req.body;
          
          const existing = await UserService.GetUser(email)
          if(existing){
            return res.render('signup', {error: "Email Address Exists Already. Please Use Another Email."})
          }
          //hash password
          let userPassword = await HashPassword(password)
          req.body.password = userPassword
          //call userservice to save to db
        const user = await UserService.AddUser(req.body);
        //generate Otp
        const otp = await GenerateOtp(email)
  
        // send otp notification
        let data = {
          email,
          title: "Confirm your Email",
          message: otp
        }
        otpEmailNotification(data, (err, resp)=>{
        if(err) return
          return
        })
  
        //remove sensitive information
        // const omitdata = _.omit(user.toJSON(), ['password', 'otp', 'createdAt', 'updatedAt'])

        req.session.email = email
        res.redirect('/verify')
        // res.render('verify-email', {email})
      } catch (e) {
        console.log(e)
        res.render('error-page-500', { error: 'Unable to Signup User'})
      }
  
    },


    completePasswordReset: async(req, res)=>{
      try{
        const {password} = req.body
        let email = req.session.email
        if(!email) return res.render('backend/auth/reset-password', {error: "An error occured while changinging password. Try signing in instead"})
        const user = await UserService.GetSingleUserByEmail(email)

        if(!user) return res.render('backend/auth/reset-password', { error: 'User does not exist'})
        if(user.dataValues.role != 'admin' && user.dataValues.role != 'minister') return res.render('backend/auth/signin', { error: 'Access Denied'})
         //hash password
        let userPassword = await HashPassword(password)
        req.body.password = userPassword
        req.body.email = email
        const updateUser = await UserService.EditUserByEmail(req.body);
        if(!updateUser) return res.render('backend/auth/signin', { error: 'Reset Password Failed. Please try again'})
        const access_token = await GenerateSignature({email: user.email, role: user.role})
        const omitdata = _.omit(user.toJSON(), ['password', 'otp', 'createdAt', 'updatedAt'])
        req.session.token = access_token;
        req.session.user = omitdata;  
        const redirectEndpoint = req.session.originalEndpoint || '/dashboard';
        // Clear the originalEndpoint from session
        delete req.session.originalEndpoint;
        res.redirect(redirectEndpoint);
       
      }catch(ex){
        console.log(ex)
        res.render('backend/error-page-500', { error: 'Unable to Change Password'})
      }
    },

    getVerifyEmailPage: async (req, res)=>{
      try{
        
        return res.render('backend/auth/verify-email') 
        }catch(e){
          console.log(e)
          res.render('backend/error-page-500', { error: "Error occured while verifying user"})
        }
    },
    getVerifyResetPasswordnPage: async (req, res)=>{
      try{
        const {email} = req.body
        if(!email) return res.render('backend/auth/verify-email', {error: "An error occured while fetching user"})
        const user = await UserService.GetSingleUserByEmail(email)

        if(!user) return res.render('backend/auth/verify-email', { error: 'User does not exist'})
        const otp = await GenerateOtp(email)
        // send otp notification
        let data = {
          username: user.dataValues.firstname,
          email,
          title: "Confirm your Email",
          message: otp
        }
        otpEmailNotification(data, (err, resp)=>{
        if(err) return
          return
        })
        req.session.url = '/reset-password'
        req.session.email = email
        res.redirect('/signin/verify')

        }catch(e){
          console.log(e)
          res.render('backend/error-page-500', { error: "Error occured while verifying user"})
        }
    },

    getResetPasswordPage: async (req, res)=>{
      try{
        
        return res.render('backend/auth/reset-password') 
        }catch(e){
          console.log(e)
          res.render('backend/error-page-500', { error: "Error occured while verifying user"})
        }
    },
    verifyOtpPasswordReset: async(req, res)=>{
      try{
        //get email from session
        let {email, url} = req.session
        // Extract OTP digits from the request body
    
        const digit1 = req.body.digit1 || '';
    const digit2 = req.body.digit2 || '';
    const digit3 = req.body.digit3 || '';
    const digit4 = req.body.digit4 || '';
    const digit5 = req.body.digit5 || '';
    const digit6 = req.body.digit6 || '';
    // Concatenate OTP digits
    const otp = digit1 + digit2 + digit3 + digit4 + digit5 + digit6;

        let request = {
          email: email,
          otp: otp
        }
        const validate = await UserService.VerifyUserOtp(request)
        if(!validate) 
        {
          const maskedEmail = maskEmail(email)
          req.session.email = email
          return res.render('backend/auth/verify-otp', { error: 'Email Verification Failed', email, url, maskedEmail}) 
        }
        

    
        res.redirect('/reset-password')
    }catch(e){
        console.log(e)
        res.render('backend/error-page-500', { error: "Error occured while verifying user"})
    }
    },



    signOut: async(req, res)=>{
      await req.session.destroy();
      res.redirect('/signin')
    },
}
// Function to mask an email address
function maskEmail(email) {
  // Split the email into parts
  const [username, domain] = email.split('@');
  
  // Mask the username and domain
  const maskedUsername = username[0] + username[1] + '***' + username[username.length - 1];
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0][0] + '***' + domainParts[0][domainParts[0].length - 1] + '.' + domainParts[1];
  
  return `${maskedUsername}@${maskedDomain}`;
}

