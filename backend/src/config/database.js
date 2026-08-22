import mongoose from "mongoose";
import seedDatabase from "./seed.js";

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI) // , {
            // dbName: "JWT"               // db defined in URI
        // }); 
        console.log("MongoDB connected");
        console.log("Database: ", mongoose.connection.name);
        
        // console.log("Host: ", mongoose.connection.host);
        // await seedDatabase();
    } catch(error) {
        console.error("MongoDB connection failed : ", error.message);
        process.exit(1);
    }
}; 

export default connectDatabase;

