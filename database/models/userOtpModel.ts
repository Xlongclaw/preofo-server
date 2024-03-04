import mongoose from "mongoose";

const UserOtpSchema = new mongoose.Schema({
  phoneNumber:String,
  otp:String,
  
  expireAt: { type: Date,  expires: 60 }
})

const userOtpModel = mongoose.model("userotp",UserOtpSchema)

export default userOtpModel
