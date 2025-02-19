

const    blogModel   =  require("../../models/blogModel")
const { validateMongoDbId } = require("../../utils/validateMongoId")


const   userModel  =   require("../../models/userModel")

const   asyncHandler  =  require("express-async-handler")

const   createBlog  =   asyncHandler(async (  req ,  res)=>{

    try {

        const   blog  =   req.body

        if(blog){



        }   else  {

    console.log({
        message:   "  Invalid  input",


    })
    res.status().json({
        message:   "Invalid  input",
        



    })
        }
        
    } catch (error) {
        
    }


})

module.exports =  {
    createBlog
}