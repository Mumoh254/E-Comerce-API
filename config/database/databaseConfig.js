const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        const DATABASEURL = process.env.MONGOOSE_CONNECTION_STRING;

        if (!DATABASEURL) {
            console.log("❌ No database connection string found.");
            process.exit(1); 
        }

        const connection = await mongoose.connect(DATABASEURL);

        console.log({
            message:  "✅ Database connection established successfully.",
            sucess:  true
        });

        return connection;

    } catch (error) {
        console.error("❌ Error connecting to the database:", error.message);
        process.exit(1); 
    }
};

module.exports = { connectToDatabase };
