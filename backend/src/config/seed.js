import User from "../models/User.js"
import bcrypt from "bcrypt"

const seedDatabase = async () =>  {
    try {
        const existingUser = await User.findOne({
            email :"admin@gmail.com"
        });

        if(existingUser) {
            console.log("Seed user already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            "123456",
            10          // This means the computer runs the math loop 2¹⁰ (or 1,024) times.
        );

        const user = await User.create({
            name: "Admin",
            email:"admin@gmail.com",
            password: hashedPassword
        })

        console.log(`Seed created for user : ${user.email}`);
    } catch(error) {
        console.error("Database seeding failed : ", error.message);
    }
};

export default seedDatabase;