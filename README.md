Without axios, your frontend cannot talk to your backend.

prerequisit : installed 
                nvm(using nvm u can install npm & nodejs) 
                    or
                {npm + nodejs@22} 
                check cmd : npm -v && node -v

1. create a fronted and backed folder  and install dependencies 
✅ Level 1 React + Tailwind + Nodejs
    frontend : npm create vite@latest app_name  
                -> react 
                -> javascript 
                -> ESlint -> y (yes) => loading will creat frontend package

    Tailwind : visit - https://tailwindcss.com/docs/installation/using-vite 
                
    backend : npm init -> (creates package.json) 
                    package.json
                        |
                        ├── "dependencies"  → What packages do I need?
                        |
                        ├── "scripts"       → What commands can I run?
                        |
                        ├── "name"          → What is my project called?
                        |
                        └── "version"       → Which version is my project?

              mkdir src && touch src/server.js 
         
 install and configer required basic dependecies
    frontend { axios, }  
        npm i axios
    backend  { express, cors,  }  
        npm i express cors



✅ Level 2  Express server
    create server - 
        const 'http' = require("http")
        const 'express' = require("require")
        const app = express()
        const server = http.createServer(app)
        server.listen(3000, () => {
            console.log("server is running at http://localhost:3000/");
        });


✅ Level 3  CORS
    Then add middleware "cors({})" and json parser "express.json()" to server :
        app.use(cors({
            // cors => "I only allow requests coming from http://localhost:5173."
            origin: "http://localhost:5173/"
        }));
        app.use(express.json(0))


✅ Level 4  Axios communication
    create api axios endpoint at :
    //there are 2 way to communicate backend from frontend, that is using fetch & axios
        import axios from "axios";   
        const API = axios.create({
            baseURL : "http://localhost:3000/"
        });
        export default API;


✅ Level 5  Login UI
    create components/Login.jsx form - 
        import { useState } from 'react';
        import API from '../service/api.jsx'
        export default function Login() {
            const [password,setPassword] = useState("");
            const [email,setEmail] = useState("");
            const [message,setMessage] = useState("");

            const handleLogin = async () => {
                try {
                    const response = await API.post({
                        email,
                        password
                    });
                    setMessage(response.data.message)
                }
                catch(error) {
                    setMessage(error.response.data.message)
                }
            };
            return (
                <>
                    <div>
                        <input onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                        <button onClick={handleLogin} > Submit </button>
                    </div>
                </>
            );
        }

✅ Level 6 Hardcoded authentication 
    Create backend authenticator(Express post req handler)  : 
        app.post("/login", (req, res) => {
            const { email, password } = req.body;   // json parser(app.use(express.json)) is necessarey
            // console.log(email,password);
            if (
                email === "admin@gmail.com" &&
                password === "123456"
            ) {
                return res.json({
                    message: "Login Successful"
                });
            }
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        });

✅ Level 7 — Backend Folder Structure : Routes → Controllers → Services
    backend/src
    ├── server.js
    ├── routes/                     "Which URL was requested?"
    │   └── authRoutes.js   
    ├── controllers/                "What should I do with this request?"
    │   └── authController.js
    ├── services/                   "How should I perform the actual operation?"
    │   └── authService.js          
    └── middlewares/

    routes/authRoutes.js
        import express from "express";
        import authController from "../controllers/authController.js";

        const router = express.Router();

        router.post("/login", authController)

        //  router.post("/login", (req, res) => { 
        //      res.json({ message : "Login route working" });
        //  });

        export default router;

    controllers/authController.js
        import authService from "../services/authService.js"

        const login = (req, res) => {
            const { email, password } = req.body;

            const result = authService.login(email,password);
           
            if(!result.success) {
                return res.status(401).json({
                    message : result.message
                });
            }

            return res.json({
                message: result.message
            });
        };
        export default login ;

    services/authService.js
        const login = ( email, password ) => {
            if (
                email === "admin@gmail.com" && 
                password === "123456"
            ) {
                return {
                    success : true,
                    message : "Login successful"
                };
            }
            return {
                success : false,
                message : "Invalid Credentials"
            };
        };
        export default { login };  

    SERVICE file :
        authService.js
                └── we exports OBJECT
                        {
                            login,
                            register,
                            logout
                        }
    CONTROLLER
        authController.js
                └── we just exports FUNCTION
                            login(req, res)


✅ Level 8 — Add MongoDB
    React >> Axios >> Route >> Controller >> Service >> MongoDB 
    display message << response created  <<  check << found(User)
    (MongoDB used in place of Hardcoded email/password)

    We're going to use Mongoose to communicate with MongoDB from server/backend.
        npm install mongoose 
    
    Add a database folder :
        backend/src/
            ├── models/
            │   └── User.js         >> Defines the structure of our database data.
            │                             User
            │                             ├── name
            │                             ├── email
            │                             └── password
            ├── config/
            │   └── database.js     >> Configuration-related things.
            │                            database connection
            │                            environment configuration


    config/database.js
        import mongoose from "mongoose"
        function connectDatabase = async () => {
            try {
                await mongoose.connect(process.env.MONGO_URI);
                console.log("MongoDB connected");
            } catch(error) {
                console.error("MongoDB connection failed: ", error.message);
                process.exit(1);
            }
        }
        export default connectDatabase ;
    
    models/User.js
        import mongoose from "mongoose";
        const userSchema = new mongoose.Schema(
            {
                name : {
                    type: String,
                    required: true
                },
                email : {
                    type : String,
                    required: true,
                    unique: true
                },
                password : {
                    type : String,
                    required : true
                }
            },{
                collection: "User",
                timestamps: true
            }
        );
        const  User = mongoose.model("User",userSchema);
        export default User;


    Install dotenv - It's a package used to load external environment variables from a .env file directly into Node.js's process.env object.
         npm install dotenv 

    Then create:
        server/src
                └── .env
            MONGO_URI=mongodb+srv://rushikeshkkale2023_db_user:<db_password>@cluster0.xozbwar.mongodb.net/<database_name>?appName=Cluster0
            PORT=5000

        Note :  Don't put .env on GitHub; for that there is .gitignore .
                Add '.env' to .gitignore :
                    node_modules/
                    .env
                & MongoDB Reminder : manually put the database name in the MongoDB URI & 

    
      
    Connect the database from server.js(modified file) : 
        import express from "express";
        import cors from "cors";
        import dotenv from "dotenv";    // Newly Added 

        import connectDatabase from "./config/database.js";    // Newly Added 
        import authRoutes from "./routes/authRoutes.js";

        dotenv.config();                // Newly Added  

        const app = express();

        app.use(cors());
        app.use(express.json());

        connectDatabase();              // Newly Added 

        app.use("/", authRoutes);

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    Run and try to connect to database cluster : 
        node server.js

        on success, you can see in terminal : 
            server is running at http://localhost:3000/ 
            MongoDB connected   
    
    We're deliberately storing:
        password: "123456"
    as plain text only for this learning stage.
    
    Our next step should be bcrypt password hashing:

    
    frontend :
    react(form - event onchange - setchanges -> submit button - onclick create axios promise(req,res))

    backend : 
    request resived by server -> allowed by CORS -> request enters server.js -> database connection request intalise by middleware then -> all http request at '/' handled by builtin express middleware app.use -> then auth route handler decides if its /login or /register (we can make /auth/login or /auth/register or /auth/forgotpass) depending on url router send request to corresponeding controller -> controller takes request and decide what to response, not logically but just structure of the response ->  for main logic check, data is send to service handler, service file find and fetch data from already connected database using collection.findone() query -> then service file check  if the credentials match or not -> send raw response back to controller, controller structure response and send back -> axios recive the response and display message 
    
✅ Level 9 — Finish bcrypt authentication
    bcrypt produces a hash, not an encrypted string. It is intentionally not reversible/decryptable. During login, bcrypt.compare() hashes/checks the entered password against the stored hash and tells us whether they match.


    Install bcrypt module using :
        npm install bcrypt

    Note : To use this module don't forgot to    import bcrypt from 'bcrypt'   before use 

    Hash the seed user's password, add code before adding it database :

        const hashedPassword = await bcrypt.hash(
            "123456",
            10
        );
    
    then,
        await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword        // change 
        });
        
    Reminder : before using seed delete, old pass from database 

    Change authService.js, add in code : 

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

    &, in place of 'if (user.password !== password)' add :
        
        if (!passwordMatch) { return{status:false}}
        

✅ Level 10 — JWT: Create a Token During Login  + Store JWT at Frontend 

    Install jsonwebtoken inside server, JWT is handled on the backend :   
        npm install jsonwebtoken


    Create utils directory inside src, to store token generator : 

    src/utils/generateToken.js : 
        import jwt from "jsonwebtoken";
        const generateToken = (user) => {
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );
            return token;
        };

        export default generateToken;


    A JWT has three parts:      HEADER.PAYLOAD.SIGNATURE   // each part seperated by '.' 
    Understand jwt.sign() :
        jwt.sign(
            payload,       // This is information we want to put inside the token.
            secret,        // The backend uses this secret to create the SIGNATURE.  
            options        // Expiration - This means the token is valid for given time .
        );

    Caution : 
        JWT payloads are normally Encoded (reverseable), not encrypted (not reverseable).
        For example, someone who has your token can decode the payload and see:
            {  "userId": "...",   "email": "admin@gmail.com"   }
        That's why you should never put sensitive information such as passwords, 
            credit-card numbers, or secrets inside the JWT payload.

    In services/authService.js    add following code : 
        import generateToken from "../utils/generateToken.js";
        
        try {
            if (!passwordMatch) {return { success: false };}

            const token = generateToken(user);       // Newly added 

            return {
                success: true,
                message: "Login Successful",
                token                               // Newly added
            };
        }; 
    
    Modify controllers/authController.js response :
        return res.json({
            message: result.message,
            token: result.token                     // Newly added
        });

    React (frontend) recives :
        {
            "message": "Login Successful",
            "token": "eyJhbGciOiJIUzI1NiIs..."
        }
    and can display using :
        console.log("JWT:", response.data.token);


    Store the JWT :
        For this learning project, let's temporarily use localStorage so you can clearly see the complete flow (in production app jwt never stored in localstorage)

    add following code in Login, handleLogin :
        const token = response.data.token;          // newly added
        localStorage.setItem("token", token);       // newly added
        setMessage(response.data.message);

    this stores token in localStorage, to use this stored token  :
        const storedToken = localStorage.getItem("token")

For a React + Node/Express web app, a common secure approach is:
    - Avoid storing JWTs in localStorage if possible, because an XSS attack can read them.
    - Access JWT: keep it short-lived (e.g. 5–15 minutes).
    - Refresh token: store it in a Secure + HttpOnly + SameSite cookie. (Advance topic for now)
    - Use HTTPS in production.
    - Keep your JWT secret/private key only on the backend.

    Authentication Route Structure
        * `app.use("/auth", authRoutes)` adds `/auth` as a prefix to all routes defined inside `authRoutes.js`.
        * Using `/auth` before authentication routes is a common professional practice because it keeps related routes organized and modular.
        * Example:
                * `POST /auth/register`
                * `POST /auth/login`
                * `POST /auth/logout`
        * `/auth` clearly identifies authentication-related endpoints, separate from resources such as `/users`, `/products`, or `/orders`.



    we haven't created the mechanism that says:
        "Show me your JWT before I allow you to access /profile route."  
        ->  Protected Route(JWT checked using Middleware )

✅ Level 11 — JWT Middleware + Protected Route
    we create    
        middlewares/
            └── authMiddleware.js

    The middleware is like a security guard, which validate JWT token then only allow let it go to controller and access /profile (which are only access owner) etc (this scenerio is after login & jwt is stored & send in request while accessing data from server)

    using middleware, Get the header & verify previlage or authority
    This:
        const authHeader = req.headers.authorization;
    gets:    Bearer eyJhbGciOiJIUzI1Ni...           

    When React makes a protected request, we'll eventually send:    
        Authorization: Bearer <JWT>
    This is called the Authorization header.
    
    If there isn't one:
        401 Unauthorized

    Extract the actual token : 
        authHeader.split(" ")     => produces: [ "Bearer", "eyJhbGciOiJIUzI1Ni..." ]
    So:
        const token = authHeader.split(" ")[1];
    gets the JWT itself.

    Verify the JWT :
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        middlewares/authMiddleware.js
            import jwt from "jsonwebtoken";
            const authMiddleware = (req,res,next) => {
                try {
                    const authHeader = req.headers.authorization;
                    if (!authHeader) {
                        return res.status(401).json({
                            message: "Authorization header is missing"
                        });
                    }
                    const token = authHeader.splite(" ")[1];
                    if(!token) {
                        return res.status(401).json({
                            message:"Token missing"
                        });
                    }
                    const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET

                    );
                    req.user = decoded;
                    next();
                } catch( error ) {
                    return res.status(401).json({
                        message: "Invalid or expired token"
                    });
                }
            };
            export default authMiddleware;
    


    Create a protected controller :
        controllers/userController.js
            const getProfile = (req, res) => {
                return res.json({
                    message: "Profile accessed successfully",
                    user: req.user
                });
            };
            export default {
                getProfile
            };
    Create user routes
        routes/userRoutes.js
            import express from "express";
            import authMiddleware from "../middlewares/authMiddleware.js";
            import userController from "../controllers/userController.js";

            const router = express.Router();
            router.get(
                "/profile",
                authMiddleware,
                userController.getProfile
            );
            export default router;


    There are three stages(when login done, token verification):
        GET /profile
            ↓
        authMiddleware >> token.verify()
            ↓
        getProfile



-------------------------------------------------------------------------------------

    ==general knowledge==


    http://localhost:3000/
    │      │         │   │
    │      host      │   path
  protocol         port
    



Understanding CORS

This confuses almost everyone initially.

Suppose your React app runs on: http://localhost:5173

Your Express server runs on: http://localhost:5000




These are different origins because they use different ports.

When React sends: POST /login

the browser says: "Wait. You're trying to access another origin. Is that server okay with this?"

If the server doesn't explicitly allow it, the browser blocks the request.
Notice that CORS is enforced by the browser, not by Express itself.