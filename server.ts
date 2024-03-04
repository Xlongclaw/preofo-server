require("dotenv").config();
import express from "express";
import generateRandomNumber from "./utils/generateRandomNumber";
const bodyParser = require("body-parser");

const server = express();
server.use(bodyParser.json());
const textflow = require("textflow.js");
const PORT = process.env.PORT ?? 8080;
textflow.useKey(process.env.TEXTFLOW_APIKEY);





server.get("/sendOtpTextFlow", async (req, res) => {
  if(req.query.serverKey == process.env.PREOFO_SERVER_KEY){
    const OTP = generateRandomNumber(6);
    textflow.sendSMS("+91" + req.query.phoneNumber, `Your Preofo Verification Code is ${OTP}`);
    res.send(JSON.stringify({ message: "OTP Sent Successfully"})).status(200);
  }
  else res.send(JSON.stringify({ message: "Invalid Preofo Server Key !!!" })).status(400);
});

server.post("/validateOtpTextFlow", async (req, res) => {
  // let result = await textflow.verifyCode("+11234567890", "USER_ENTERED_CODE");
  // console.log(result);
});

server.listen(PORT, () => {
  console.log(`Preofo Server Listening on PORT : ${PORT}`);
});
