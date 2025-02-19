


const  express  =  require('express')
const   router  =   express.Router()

const authMiddleware = require("../middleWares/authMiddleware");
const { isAdmin } = require("../middleWares/isAdmin");

const  {createCategory}  =  require("../controllers/productControllers/categoryController")

router.post("/create" , authMiddleware ,  isAdmin , createCategory )

module.exports  =  router;