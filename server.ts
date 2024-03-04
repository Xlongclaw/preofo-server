require("dotenv").config();
import express from "express";
import generateRandomNumber from "./utils/generateRandomNumber";
import connectDB from "./database/connectDB";
import userOtpModel from "./database/models/userOtpModel";
const bodyParser = require("body-parser");

const server = express();
server.use(bodyParser.json());
const textflow = require("textflow.js");
const PORT = process.env.PORT ?? 8080;
textflow.useKey(process.env.TEXTFLOW_APIKEY);

server.get("/sendOtp", async (req, res) => {
  if (req.query.serverKey == process.env.PREOFO_SERVER_KEY) {
    const OTP = generateRandomNumber(6);
    textflow.sendSMS(
      "+91" + req.query.phoneNumber,
      `Your Preofo Verification Code is ${OTP}`
    );
    await userOtpModel.findOneAndDelete({phoneNumber:req.query.phoneNumber})
    await userOtpModel.create({phoneNumber:req.query.phoneNumber,otp:OTP,expireAt:new Date()})
    res.send(JSON.stringify({ message: "OTP Sent Successfully" })).status(200);
  } else
    res
      .send(JSON.stringify({ message: "Invalid Preofo Server Key !!!" }))
      .status(400);
});

server.get("/validateOtp", async (req, res) => {
  let user = await userOtpModel.findOne({phoneNumber:req.query.phoneNumber})
  if(user){
    if(user.otp === req.query.otp) res.json({'code':'SUCCESS'}).status(200)
    else res.json({'code':'INVALID_OTP'}).status(400)
  }
  else res.json({'code':'OTP_EXPIRED'}).status(401)
});

server.get('/',(req,res)=>{
  res.send("I am Preofo Server and i am running")
})

server.listen(PORT, async () => {
  console.log(`Preofo Server Listening on PORT : ${PORT}`);
  await connectDB()
    .then(() => console.log("Data Connection successful."))
    .catch((err) => console.error(err));
});
