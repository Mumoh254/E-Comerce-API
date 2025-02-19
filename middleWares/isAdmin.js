const userModel = require("../models/userModel");

const isAdmin = async (req, res, next) => {
    try {
        const { email } = req.user;
        // Find the user with the email from the request
        const adminUser = await userModel.findOne({ email: email });
        console.log({
            message:  "I  am  an  administrator",

        })
        console.log(adminUser)

        // Check if the user is an admin

        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({
                message: "You don't have permission to perform this action",
                status: 403,
                data: null,
                success: false,
            });
            console.log( {
                message:  "Your  not  allowed to   perform  this  action"
            })
        } else {
            console.log({
                message:  "I  am  an   admin  am  prociding  to  the  next  step"
            })
            // Proceed to the next 
            next();
           
        }
    } catch (error) {
        console.log("An error occurred verifying admin status: " + error.message);
        return res.status(500).json({
            message: "Internal server error during admin verification",
            status: 500,
            data: null,
            success: false,
        });
    }
};

module.exports = { isAdmin };
