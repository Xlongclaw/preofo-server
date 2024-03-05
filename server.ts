require("dotenv").config();
import express from "express";
import generateRandomNumber from "./utils/generateRandomNumber";
const bodyParser = require("body-parser");
const partnerModel = require('./database/models/partnerModel')
const verifyToken = require('./utils/verifyToken')
const userOtpModel = require("./database/models/userOtpModel");
const connectDB = require('./database/connectDB')
const server = express();
server.use(bodyParser.json());
const textflow = require("textflow.js");
const PORT = process.env.PORT ?? 8080;
textflow.useKey(process.env.TEXTFLOW_APIKEY);
const generateToken = require('./utils/generateToken')


server.get("/sendOtp", async (req, res) => {
  if (req.query.serverKey == process.env.PREOFO_SERVER_KEY) {
    const OTP = generateRandomNumber(4);
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
    if(user.otp == req.query.otp){
      const userToken = generateToken(req.query.phoneNumber)
      res.json({'code':'SUCCESS',userToken}).status(200)
    }  
    else res.json({'code':'INVALID_OTP'}).status(400)
  }
  else res.json({'code':'OTP_EXPIRED'}).status(401)
});

server.post("/addUser", async (req, res) => { 
  const tokenData = verifyToken(req.body.userToken)
  if(tokenData.status == 'VERIFIED'){
    await partnerModel.create({name:req.body.name,password:req.body.password,phoneNumber:tokenData.data})
    res.send("SUCCESS").status(200)
  }
  else{
    res.send("INVALID_TOKEN").status(400)
  }
});

server.get('/',(req,res)=>{
  res.send("I am Preofo Server and i am running")
})

server.listen(PORT, async () => {
  console.log(`Preofo Server Listening on PORT : ${PORT}`);
  await connectDB()
    .then(() => console.log("Data Connection successful."))
    .catch((err:any) => console.error(err));
});
