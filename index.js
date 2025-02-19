const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoute");
const  categoryRouter  =   require("./routes/categoryRoute");
const {logger} = require("./logger.js");
const  {connectToDatabase}  =  require("./config/database/databaseConfig.js");
const app = express();
 
// Middleware to parse JSON request bodies
app.use(express.json());

// Security headers

app.use(helmet());

app.use(helmet.hsts({

    maxAge: 31536000,  
    includeSubDomains: true, 
    preload: true,  


}));


app.use(helmet.hidePoweredBy());
app.use(morgan("dev"))

// Logging setup 
if (process.env.NODE_ENV_ENVIRONMENT === "development") {
    const morganFormat = ":method :url :status :response-time ms";
    app.use(morgan(morganFormat, {
        stream: {
            write: (message) => {
                logger.info(message.trim()); // Log full message directly
            },
        },
    }));
}

// CORS configuration
app.use(cors({
    origin: "http://localhost:8000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-type"],
    credentials: true,
}));

app.use(cookieParser());

// API Routes
app.use("/apiV1/majestycollections", authRouter);
app.use("/apiV1/products", productRouter);
app.use("/apiV1/category",  categoryRouter );


// Start the server

const fireUpServer = async () => {

    try {

        
        await connectToDatabase();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log({
                message:  `  Server  is   up  and   running   a  on  port ${PORT}`
            });

        });

    } catch (error) {
        console.error("Error starting the server:", error.message);
    }
};

fireUpServer();
