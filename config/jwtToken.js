const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  if (!user || !user._id || !user.email || !user.role) {
    throw new Error("Invalid user data for token generation");
  }

  // 🛑 Debugging: Log the user data before generating a token
  console.log("Generating token for user:", {
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET_KEYS_AUTHORIZE,  // ✅ Correct placement of secret key
    { expiresIn: "2d" }
  );
};

module.exports = { generateToken };
