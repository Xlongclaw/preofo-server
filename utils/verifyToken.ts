

const verifyToken = (token:string) => {
  const jwt = require("jsonwebtoken");
  try{
    const data = jwt.verify(token,process.env.JWT_SECRET);
    return {status:'VERIFIED',data}
  }
  catch(err){
    return {status:'INVALID'}
  }
};

module.exports = verifyToken