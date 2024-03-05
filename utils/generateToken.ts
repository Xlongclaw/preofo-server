const generateToken = (payload:string) => {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

module.exports = generateToken