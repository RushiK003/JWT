import User from "../models/User.js"
import mongoose from "mongoose"
import bcrypt from "bcrypt"


const login = async (email, password) => {
    console.log("i was at auth services", email)
    console.log("Searching for email:", JSON.stringify(email), " on ", mongoose.connection.name);
    const user = await User.findOne({ email });
    
    if (!user) {
        return {
            success: false,
            message: "Invalid Credentials"
        };
    }

    console.log("from database: ",user.email)
    console.log("i was at auth services before ")

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    // if (user.password !== password) {

    if(!passwordMatch){
        return {
            success: false,
            message: "Invalid Credentials"
        };
    }

    return {
        success: true,
        message: "Login Successful"
    };


    // if (
    //     email === "admin@gmail.com" && 
    //     password === "123456"
    // ) {
    //     return {
    //         success : true,
    //         message : "Login successful"
    //     };
    // }

    // return {
    //     success : false,
    //     message : "Invalid Credentials"
    // };
};

// export default login;         
// exported itself as login function not object

export default { login };
// exporting login function as sub-function of object
// to use we write Object.login()
