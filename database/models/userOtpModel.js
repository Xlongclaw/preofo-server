const mongoose = require('mongoose')
const UserOtpSchema = new mongoose.Schema({
  phoneNumber:String,
  otp:String,
  
  expireAt: { type: Date,  expires: 300 }
})

const userOtpModel = mongoose.model("userotp",UserOtpSchema)

module.exports = userOtpModel