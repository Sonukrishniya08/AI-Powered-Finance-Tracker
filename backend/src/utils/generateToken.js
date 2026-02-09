const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }   // ✅ 1 day expiry
  );
};
module.exports = generateToken;
