const jwt = require("jsonwebtoken");
require("dotenv").config()

const generateRefreshToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEYS_AUTHORIZE, {
        expiresIn: "72h",
    });
};

module.exports = { generateRefreshToken };
