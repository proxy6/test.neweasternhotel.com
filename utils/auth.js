
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const SECRET_KEY = `${process.env.JWT_SECRET}`
const { Employee } = require('../models');

module.exports = {
    GenerateSignature: async (payload) => {
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' /*Expires in 1 day*/ })
    },
    GenerateRefreshToken: async(payload)=>{
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' /*Expires in 1 day*/ })
    },
    HashPassword: async (password) => {
        const salt = bcrypt.genSaltSync(10)
        const userPassword = bcrypt.hash(password, salt)
        return userPassword
    },
    GenerateOtp: async (email) => {
        let otp = Math.floor(100000 + Math.random() * 900000);
        // let otp = Math.floor(100013 + Math.random() * 29000);
        const [affectedRows] = await Employee.update(
            { otp: otp},
            { where:{ email: email}
        })
      
        if(affectedRows > 0){
            return otp
        }else{
            return false
        }
        
    },
    validatePassword: async (data)=>{
        const {password, savedPassword} = data
        const validatePassword = bcrypt.compareSync(password, savedPassword)
        console.log("validatePassword")
        console.log(validatePassword)
        if(!validatePassword) return false
        return true
    }
}