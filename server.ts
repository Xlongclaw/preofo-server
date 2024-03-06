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

/**
 * COMMON APIs:
 * 
 * These APIs can be used by both preofo-partner application and preofo application.
 */
server.get("/sendOtp", async (req, res) => {
  if (req.query.serverKey == process.env.PREOFO_SERVER_KEY) {
    const OTP = generateRandomNumber(4);
    textflow.sendSMS(
      "+91" + req.query.phoneNumber,
      `Your Preofo Verification Code is ${OTP}`
    );
    await userOtpModel.findOneAndDelete({phoneNumber:req.query.phoneNumber})
    await userOtpModel.create({phoneNumber:req.query.phoneNumber,otp:OTP,expireAt:new Date()})
    res.status(200).send(JSON.stringify({ message: "OTP Sent Successfully" }))
  } else
    res.status(400)
      .send(JSON.stringify({ message: "Invalid Preofo Server Key !!!" }))
      
});

server.get("/validateOtp", async (req, res) => { 
  let user = await userOtpModel.findOne({phoneNumber:req.query.phoneNumber})
  if(user){    
    if(user.otp == req.query.otp){
      const userToken = generateToken(req.query.phoneNumber)
      res.status(200).json({'code':'SUCCESS',userToken})
    }  
    else res.status(400).json({'code':'INVALID_OTP'})
  }
  else res.status(401).json({'code':'OTP_EXPIRED'})
});


/**
 * USER SPECIFIC APIs
 */

/**
 * BODY REQ - {name,password,userToken}
 */
server.post("/addUser", async (req, res) => { 
  const tokenData = verifyToken(req.body.userToken)
  if(tokenData.status == 'VERIFIED'){
    await partnerModel.create({name:req.body.name,password:req.body.password,phoneNumber:tokenData.data})
    res.status(200).json({'code':'SUCCESS'})
  }
  else{
    res.status(400).json({'code':'INVALID_TOKEN'})
  }
});


/**
 * Params = userToken
 */
server.get("/getUserFromUserToken", async (req, res) => { 
  const tokenData = verifyToken(req.query.userToken)
  if(tokenData.status == 'VERIFIED'){
    const data = await partnerModel.find({phoneNumber:tokenData.data})
    res.status(200).json({'code':'SUCCESS',data})
  }
  else{
    res.status(400).json({'code':'INVALID_TOKEN'})
  }
});


/**
 * Params = phoneNumber,password
 */
server.get("/getUserFromCredentials", async (req, res) => { 
  const {phoneNumber,password} = req.query;
  const user = await partnerModel.findOne({phoneNumber})
  if(user){
    if( user.password === password){
      const userToken = generateToken(req.query.phoneNumber)
      res.json({'code':"SUCCESS",user,userToken})
    }
    else res.status(400).json({'code':'PASSWORD_DOES_NOT_MATCH'})
  }
  else res.status(400).json({'code':'USER_DOES_NOT_EXIST'})
});


/**
 * PARTNER SPECIFIC APIs
 */


/**
 * Body required ->
 *   {
 *    name:string,
 *    password:string,
 *    userToken:string
 *    }
 * 
 * Endpoint -> /addPartner
 * method -> POST
 */
server.post("/addPartner", async (req, res) => { 
  const tokenData = verifyToken(req.body.userToken)
  if(tokenData.status == 'VERIFIED'){
    await partnerModel.create({name:req.body.name,password:req.body.password,phoneNumber:tokenData.data})
    res.status(200).json({'code':'SUCCESS'})
  }
  else{
    res.status(400).json({'code':'INVALID_TOKEN'})
  }
});


/**
 * Params = userToken
 */
server.get("/getPartnerFromUserToken", async (req, res) => { 
  const tokenData = verifyToken(req.query.userToken)
  if(tokenData.status == 'VERIFIED'){
    const data = await partnerModel.find({phoneNumber:tokenData.data})
    res.status(200).json({'code':'SUCCESS',data})
  }
  else{
    res.status(400).json({'code':'INVALID_TOKEN'})
  }
});


server.get("/getPartnerFromCredentials", async (req, res) => { 
  const {phoneNumber,password} = req.query;
  const user = await partnerModel.findOne({phoneNumber})
  if(user){
    if( user.password === password){
      const userToken = generateToken(req.query.phoneNumber)
      res.json({'code':"SUCCESS",user,userToken})
    }
    else res.status(400).json({'code':'PASSWORD_DOES_NOT_MATCH'})
  }
  else res.status(400).json({'code':'USER_DOES_NOT_EXIST'})
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
