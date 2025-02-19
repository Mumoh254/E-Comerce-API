const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // Using bcryptjs for better promise support

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,


    isLocked: { type: Boolean, default: false },

    address: {
        type:  String
    },

    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: [],
        required: false
    }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Skip hashing 
    if (this.password.startsWith("$2b$")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now() - 1000;
    console.log("Hashed password:", this.password);
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    console.log({
        message: "Checkng  if   password  matches   enteredn  password "
    })
    return await bcrypt.compare(enteredPassword, this.password);

};

// Create a password reset toke
userSchema.methods.createPasswordResetToken = async function () {
    // Generate a random token
    const resettoken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token before storing it in the database
    this.passwordResetToken = crypto.createHash('sha256').update(resettoken).digest("hex");

    // expiration  time
    this.passwordResetExpires = Date.now() + 10 * 60 * 60 * 1000;

    return resettoken;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;