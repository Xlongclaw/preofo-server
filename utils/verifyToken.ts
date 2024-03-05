const verifyToken = (token:string) => {
  const jwt = require("jsonwebtoken");
  try{
    const data = jwt.verify(token,process.env.JWT_SECRET);
    return {status:'VERIFIED',data}
  }
  catch(_){
    return {status:'INVALID'}
  }
 
};

module.exports = verifyToken