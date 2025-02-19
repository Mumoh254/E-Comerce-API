
  const  mongoose    =  require("mongoose");




// Database connection function
const connectToDatabase = async () => {
    const DATABASEURL = process.env.MONGOOSE_CONNECTION_STRING;
    if (!DATABASEURL) {
        console.log("There's no connection string to the database.");
        return;
    }

    try {
        await mongoose.connect(DATABASEURL);
        console.log("Database connection established");
    } catch (error) {
        console.log("Error connecting to the database:", error.message);
    }
};


module.exports  =  {
    connectToDatabase
}