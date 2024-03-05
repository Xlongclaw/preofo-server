import { error } from "console";

const verifyToken = (token:string) => {
  const jwt = require("jsonwebtoken");
  try{
    const data = jwt.verify(token,process.env.JWT_SECRET);
    console.log(data);
    
    return {status:'VERIFIED',data}
  }
  catch(err){
    console.log(error)
    return {status:'INVALID'}
  }
};

module.exports = verifyToken