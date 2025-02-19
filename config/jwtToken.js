const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateToken = (id) => {
  try {
    return jwt.sign(
      { id }, 
      process.env.JWT_SECRET_KEYS_AUTHORIZE, 
      { expiresIn: "2d" }
    );
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Could not generate token");
  }
};

module.exports = {generateToken};
