import User from "../models/User.js"

const seedDatabase = async () =>  {
    try {
        const existingUser = await User.findOne({
            email :"admin@gmail.com"
        });

        if(existingUser) {
            console.log("Seed user already exists");
            return;
        }

        const user = await User.create({
            name: "Admin",
            email:"admin@gmail.com",
            password: "123456"
        })

        console.log(`Seed user created : ${user.email}`);
    } catch(error) {
        console.error("Database seeding failed : ", error.message);
    }
};

export default seedDatabase;