const express = require("express");
// Controller imports
const { createUser } = require("../controllers/authController/authControl");
const { logInUser, handleRefreshToken } = require("../controllers/authController/loginControl");
const { getUsers, getUser } = require("../controllers/authController/getUsers");
const { deleteUser } = require("../controllers/authController/deleteUser");
const authMiddleware = require("../middleWares/authMiddleware");
const { updateUser } = require("../controllers/authController/updateUser");
const { isAdmin } = require("../middleWares/isAdmin");
const { logOut } = require("../controllers/authController/logOut");
const { updatePassword } = require("../controllers/authController/updatePassword");
const { logIn } = require("../controllers/authController/login");
const { resetPassword } = require("../controllers/authController/resetPass");
const { forgotPasswordToken } = require("../controllers/authController/forgotPasswordToken");
const { logInAdmin } = require("../controllers/AdminController/loginAdmin");
const   { userCart  ,   getUserCart  ,  emptyCart   }  =  require("../controllers/authController/userCart")
const   {  createOrder  ,  getOrders  , getOrderById  ,   updateOrderStatus }    =  require("../controllers/orders/createOrder")
const router = express.Router();


//   cart
router.post("/user/cart" , authMiddleware   , userCart )

router.get("/user/cart" , authMiddleware   , userCart )
router.get("/cart" , authMiddleware  ,   getUserCart)

router.delete("/clear/cart" , authMiddleware  ,  emptyCart )



//   make  an  order request
router.post("/cart/order" , authMiddleware  ,    createOrder)


// get orders for  admin
router.get("/user/getorders/:id" , authMiddleware  ,      getOrderById )


router.get("/admin/getorders" , authMiddleware  ,  isAdmin ,     getOrders)
router.put("/update/orderstatus/:id " , authMiddleware  ,  isAdmin ,    updateOrderStatus )



// Admin routes
router.get("/allusers", authMiddleware, isAdmin, getUsers);
router.get("/getuser/:id", authMiddleware, isAdmin, getUser);
router.put("/getuser/updatestatus/:id", authMiddleware, isAdmin,   updateOrderStatus);
// router.put("/blockuser/:id", authMiddleware, isAdmin, blockUser); 
// router.put("/unblockuser/:id", authMiddleware, isAdmin, unblockUser);  
router.delete("/deleteuser/:id", authMiddleware, isAdmin, deleteUser);

// Password reset routes
router.post("/forgotpass/send", forgotPasswordToken);  
router.get("/forgotpass/reset/:token", resetPassword); 

// Auth routes
router.post("/login", logInUser);
router.post("/logins", logIn);
router.post("/register", createUser);
router.put("/resetpassword", authMiddleware, updatePassword);


//   admin   login and  routes 
router.post("/login/admin", logInAdmin);
// Token management routes
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOut);

// User management routes
router.put("/updateuser/:id", authMiddleware, updateUser);

module.exports = router;
