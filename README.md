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

    add following code in Login to store Token, handleLogin :
        const token = response.data.token;          // newly added
        localStorage.setItem("token", token);       // newly added
        setMessage(response.data.message);

    For a production authentication system, token storage has important XSS/CSRF security tradeoffs, and a common architecture is to use HttpOnly, Secure cookies for sensitive session/refresh credentials.

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


    Add following code to login.jsx, and use recived token to access protected route : 
                    
        const [token, setToken] = useState("");   // just to store tempory, on reload its gone
                                                // better than this store in localstorage

        const handleProfile = async () => {
            try {
                const profileResponse = await API.get("/profile", {
                    headers: {
                        // Authorization: `Bearer ${token}`
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setMessage(profileResponse.data.message);
                console.log(profileResponse.data);      
            } catch (error) {
                console.error("Error fetching profile:", error.response.data.message);
                setMessage(error.response.data.message);    
            }
        }
        return (
                <button className="" onClick={handleProfile}>
                    Profile
                </button>
        )
        


✅ Level 12 — Axios Interceptor + Display user_ID & token 
    Stored the JWT, now to for access the protected data get token from localstorage:
        Backend
           ↓
          JWT
           ↓
         React
           ↓
       localStorage (temprorily stored while learing)

    We're going to add an Axios interceptor, which help in accessing /profile :
        API.get("/profile")
            ↓
        Axios Interceptor
            ↓
        Get token (for now its in localStorage)
            ↓
        Attach Authorization header
            ↓
        Send request to backend 

    Backend resives the request :
        GET /profile
            ↓
        authMiddleware
            ↓
        extract token      ---- token not found ---> returns "Authorization header missing"
            ↓
        jwt.verify()       ---  not matched  ---> returns "401 Unauthorized"
            ↓
        req.user = decoded  
            ↓
        next()
            ↓
        getProfile()
            ↓
        send to frontend


    What is an interceptor?
        Think of it as a checkpoint inside Axios.
        you write  "API.get("/profile");" 
        and Axios automatically adds:  "Authorization: Bearer <JWT>" in request header
        
    Else you have to manually add token to header for each request :
        API.get("/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    frontend/src/services/api.js
        import axios from "axios";
        const API = axios.create({ baseURL: "http://localhost:5000" });
        API.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("token");
                if (token) { config.headers.Authorization = `Bearer ${token}`; }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        export default API;


    frontend/src/components/Profile.jsx
        import { useEffect, useState } from "react";
        import API from "../services/api";
        const Profile = () => {
            const [user, setUser] = useState(null);
            const [message, setMessage] = useState("");
            useEffect(() => {
                const getProfile = async () => {
                    try {
                        const response = await API.get("/profile");
                        setUser(response.data.user);
                    } catch (error) {
                        setMessage(
                            error.response?.data?.message ||
                            "Failed to load profile"
                        );
                    }
                };
                getProfile();
            }, []);

            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">
                        Profile
                    </h1>
                    {message && (
                        <p>{message}</p>
                    )}
                    {user && (
                        <div>
                            <p> User ID: {user.userId} </p>
                            <p> Email: {user.email} </p>
                        </div>
                    )}
                </div>
            );
        };
        export default Profile;

    frontend/src/App.jsx:
        import Login from "./components/Login";
        import Profile from "./components/Profile";
        const App = () => {
            return (
                <>
                    <Login />
                    <Profile />
                </>
            );
        };
        export default App;
    This isn't how we'd structure the final application, we'll eventually use React Router 
    but it's perfect for learning the JWT flow.

✅ Level 13 - Frontend : React Router + Auth Context + Protected Route
    We'll learn three concepts for sucure & optimised frontend :
      1.React Router
      2.Authentication state
      3.Protected routes

    [1.]  React Router
    Inside your frontend/client:
        npm install react-router-dom
    
    "react-router-dom" package :—
    It gives React the ability to understand browser URLs, and load(route to) the page.
    In react project,You have one React application, and React Router decides:
        "The browser URL is /profile, so I should show ProfilePage."

    react-router-dom have in build function, Think it like : 
        Browser URL   => is monitored by using <BrowserRouter>
            ↓
        React Router  => changed URL goes to group of routers
            ↓
        "Which component should I show?"  => match with path="" of router
            ↓
        Component    =>  loads the element={}
    
    <BrowserRouter> : Manages/observes the browser URL for your React Router app.

    <Routes> : Contains your routing rules.
        <Routes>
            <Route path="" element={} />
            <Route path="" element={} />
            <Route path="" element={} />
        </Routes>

    <Route path="" element={} /> : Connects a URL to a component.
        URL → Component
        For example:   <Route path="/profile" element={<ProfilePage />} />

        The path says:
        "What URL should trigger this page?"

        The element says:
        "What should I display?"


    <Link to="/profile"> Profile </Link>    // similar to <a> anchor tag 
        -> Gives the user a clickable way to change the route.
                Click → change URL to route
        It is not required for a route to exist.

        You might wonder:  "Why not just use <a>?"
        Because Link is designed to work with React Router's navigation system, allowing navigation without doing a traditional full-page browser reload.

    Link = user clicks something to navigate.
    navigate = your JavaScript code decides to navigate.

    The name: useNavigate
    starts with 'use', which tells you:  "This is a React Hook."

    useNavigate => navigate("");
        You import it:  
            import { useNavigate } from "react-router-dom";
        Then inside a React component:      "ask for the navigation function"
            const navigate = useNavigate();       // Now 'navigate' is a function.
        You can call it:
            navigate("/profile");
        And React Router will take the user to:
            path  /profile, and load that element/page


    Let's separate pages from components : 
    src/
      ├── components/
      │
      ├── pages/
      │   ├── LoginPage.jsx
      │   └── ProfilePage.jsx
      └── services/
            └── api.js

    Move your login UI into:
    src/pages/LoginPage.jsx

    And add following code LoginPage.jsx, to navigate to profile page:
        import . . .
        import { useNavigate } from "react-router-dom";
        . . . 
        const handleLogin = async (event) => {
            event.preventDefault();
            try { const response = await API.post("/login", { email, password });
                  localStorage.setItem( "token", response.data.token );
                  setMessage("Login Successful");

                navigate("/profile");       //// Newly added ////

            } catch (error) {
                setMessage( error.response?.data?.message || "Login failed" );
            }
        };
    
    
    src/pages/ProfilePage.jsx
        import { useEffect, useState } from "react";
        import API from "../services/api";
        const ProfilePage = () => {
            const [user, setUser] = useState(null);
            const [message, setMessage] = useState("");
            useEffect(() => {
                const getProfile = async () => {
                    try {
                        const response = await API.get("/profile");
                        setUser(response.data.user);
                    } catch (error) {
                        setMessage(
                            error.response?.data?.message ||
                            "Failed to load profile"
                        );
                    }
                };
                getProfile();
            }, []);
            return (
                <div className="p-8">
                    <h1 className="mb-4 text-3xl font-bold">
                        Profile
                    </h1>
                    {message && (
                        <p>{message}</p>
                    )}
                    {user && (
                        <div>
                            <p>User ID: {user.userId}</p>
                            <p>Email: {user.email}</p>
                        </div>
                    )}
                </div>
            );
        };
        export default ProfilePage;

    Changes in App.jsx 
    frontend/src/App.jsx
        import {
            BrowserRouter,
            Routes,
            Route
        } from "react-router-dom";
        import LoginPage from "./pages/LoginPage";
        import ProfilePage from "./pages/ProfilePage";
        const App = () => {
            return (
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={<LoginPage />}
                        />
                        <Route
                            path="/profile"
                            element={<ProfilePage />}
                        />
                    </Routes>
                </BrowserRouter>
            );
        };
        export default App;


        [X] But there's a security problem 
        Right now, anyone can manually type: http://localhost:5173/profile
        The React application will show the Profile page.
        The backend will eventually reject the API request because there's no JWT, but from the frontend perspective, we dont have any check or protection, we haven't actually protected the route.

        create ProtectedRoute 
        frontend/src/components/ProtectedRoute.jsx
            import { Navigate } from "react-router-dom";
            const ProtectedRoute = ({ children }) => {
                const token = localStorage.getItem("token");
                if (!token) {
                    return <Navigate to="/login" replace />;
                }
                return children;
            };
            export default ProtectedRoute;

        Use ProtectedRoute in App.jsx (while routing sensitive data)
            import {
                BrowserRouter, Routes, Route, Navigate
            } from "react-router-dom";
            import . . .
            import ProtectedRoute from "./components/ProtectedRoute";
            const App = () => {
                return (
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />

                            <Route path="/profile" 
                                element={
                                    // creating Protecting layer around it

                                    <ProtectedRoute>     
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            // A Route redirect all URL req to '/login' page
                            <Route              
                                path="*"
                                element={
                                    <Navigate to="/login" replace />
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                );
            };
            export default App;


            Frontend protection  ->   ProtectedRoute
                only controls the UI/navigation. 
                (not really validate,just check Token exists or empty)
                even after expired or fake value, it allow to route further
            Backend protection   ->  authMiddleware
                provides the actual security.  
                jwt.verify() -> INVALID -> 401 Unauthorize access

            Therefore, Never rely on React's ProtectedRoute alone for security.

            What we have learned so far :
            ___________________________________________________________
            | Concept           | Purpose                              |
            | ------------------|--------------------------------------|
            | Axios             | Frontend ↔ Backend communication     |
            | CORS              | Allows browser cross-origin requests |
            | Route             | Maps URL → handler                   |
            | Controller        | Handles request/response             |
            | Service           | Business logic                       |
            | Model             | MongoDB data structure               |
            | bcrypt            | Password hashing/checking            |
            | JWT `sign()`      | Creates authentication token         |
            | JWT `verify()`    | Validates token                      |
            | Middleware        | Runs checks before controller        |
            | Axios interceptor | Automatically attaches JWT           |
            | React Router      | Handles frontend URLs                |
            | ProtectedRoute    | Controls access to frontend pages    |
            |___________________|______________________________________|

    In Next level we will learn about : 
    Context Hook 
         is a feature in react that allows you to share data globally across your component tree without having to manually pass props down through every single level. 
    
    The Problem Context hook Solves:  Prop Drilling
        In a standard React application, data is passed top-down (parent to child) via props. If a component deep in the tree needs data from a high-level parent, you have to pass that data through every intermediate component—even if those intermediate components don't care about the data themselves. This is known as prop drilling, and it leads to bloated, hard-to-maintain code
    
    Note :
        before moving forward make sure you understood the difference :
         
            Named export   [ export const user = {}; ]  
                and named import → { user }

            Default export    [ const user = {};    export default user; ] 
                and default import → [ import user from "./user"; ]

        This distinction is extremely important for Context.

Level 14: AuthContext

    The problem: authentication is scattered
        different parts of the application handle authentication independently:
            LoginPage
            └── localStorage.setItem("token")
            ProtectedRoute
            └── localStorage.getItem("token")

    The goal : Create one central place responsible for authentication state.
                  
                    AuthProvider
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
          Login       Navbar      Profile
             │           │           │
             └───────────┴───────────┘
                         ↓
                   AuthContext

    Think of Context/AuthContext as a shared data container

    It can provide:
        user
        isAuthenticated
        login()
        logout()
    to any component inside the provider.

    Instead of passing user through many components:
        App
         ↓
        Navbar
         ↓
        UserMenu

    you can directly access it using :
        const { user } = useAuth();     // or any other named_export

    Working flow : 
    1. createContext() is imported and AuthContext object is created.
    2. AuthProvider component manages user state (user, login, logout, restoreAuth).
    3. <AuthContext.Provider value={{...}}> wraps children and shares the state.
    4. main.jsx wraps <App /> inside <AuthProvider> so the whole app gets access.
    5. useAuth() custom hook uses useContext(AuthContext) to read the data.
    6. Components (Login, Navbar, ProtectedRoute) import useAuth and consume the state.
    7. On login, LoginPage calls login(response.data.user) to update context state.

    1. createContext()

        const AuthContext = createContext();   //This creates the Context object.
                    // But creating Context doesn't automatically give it data.
                    
        The information is provided later by:
            <AuthContext.Provider value={...}>

    2. AuthProvider

        export const AuthProvider = ({ children }) => { ... }

        AuthProvider is a React component whose job is to provide authentication data to its children. 

        For example:
            <AuthProvider>
                <App />
            </AuthProvider>

            AuthProvider    
                │               // Everything inside App can access the AuthContext / auth data.
                └── App
                    ├── LoginPage
                    ├── ProfilePage
                    ├── Navbar
                    └── ProtectedRoute

    Create context in frontend (separated for Vite Fast Refresh) :
    src/context/AuthContext.jsx
        import { createContext } from "react";

        export const AuthContext = createContext();      // Exported so useAuth and AuthProvider can import it

    src/context/AuthProvider.jsx                         // Component separated so Vite Fast Refresh works
        import { useState } from "react";
        import { AuthContext } from "./AuthContext";

        export const AuthProvider = ({ children }) => {

            const [user, setUser] = useState(null);     // This stores the currently logged-in user. 
            
            const login = (userData) => {           // This function updates the authentication state.
                setUser(userData);
            };

            const logout = () => {                      //Logout performs two important operations:
                localStorage.removeItem("token");       // 1. Remove JWT from localStorage 
                setUser(null);                          // 2. Clear React state
            }; 

            const isAuthenticated = !!user;             // This is a convenient boolean. The !! converts a value into true or false.

            return (
                <AuthContext.Provider                   
                    value={{            // Everything placed inside value becomes available to child components using the context.
                        user,
                        login,
                        logout,
                        isAuthenticated
                    }}
                >
                    {children}      // for Ex., in mainjs : <AuthProvider><App /></AuthProvider> , there App is child which have access of values
                                    // means: "Render whatever was placed inside AuthProvider, while giving it access to the AuthContext."
                </AuthContext.Provider>
            );
        };


    src/context/useAuth.jsx                                         
        import { useContext } from 'react'
        import { AuthContext } from './AuthContext'

        export const useAuth = () => {                          // useAuth() is a custom hook.
            return useContext(AuthContext);
        };



    Now to use data from context, Wrap your application : 
    frontend/src/main.jsx
        import { StrictMode } from "react";
        import { createRoot } from "react-dom/client";
        import App from "./App.jsx";
        import { AuthProvider } from "./context/AuthProvider";
        createRoot(document.getElementById("root")).render(
            <StrictMode>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </StrictMode>
        );

    Every component inside AuthProvider can use authentication or we can say value : { user,login,logout,isAuth}.


    Return user information from backend in better/optimum way
    In authService.js, change the successful return:
        ...
        return {
            success: true,
            message: "Login Successful",
            token,
            user: {
                userId: user._id,
                email: user.email,
                name: user.name
            }
        };
        ...
    
    & Then in authController.js:
        ...
        return res.json({
            message: result.message,
            token: result.token,
            user: result.user
        });
        ...

    
    Modify LoginPage  : 
        . . . . ....
        import { useAuth } from "../context/useAuth";  // newly added 

        function Login() {
            const { login } = useAuth();   // destructuring and takeing login function ? 
            . . . . ...
            const navigate = useNavigate();   

            const handleLogin = async (e) => {
                e.preventDefault();
                try {
                    const response = await API.post("/auth/login",{ email, password });
                    // Now from backend respose formate change to : 
                    // { "message": "Successful", "token": "eyJhb...","user": {"userId":"...","email":"...", "name": "..." }

                    localStorage.setItem(
                        "token",
                        response.data.token
                    );

                    login(response.data.user);        // We want LoginPage to tell AuthContext: "The user successfully logged in."
            
                    navigate("/profile");

                } catch (error) {   }
            }

            return (
                <div className="flex justify-center items-center h-screen p-4">
                    <form >
                        <h1 > Login </h1> 
                        <input />   <input />    
                        <button> Login  </button>
                        <div className="mt-2"> {message} </div>
                    </form>
                </div>
            );
        } }
        export default Login;


    Modify ProtectedRoute : 
        import { Navigate } from "react-router-dom";
        import { useAuth } from "../context/useAuth";

        const ProtectedRoute = ({ children }) => {

            const { isAuthenticated } = useAuth();

            if (!isAuthenticated) {
                return <Navigate to="/login" replace />;
            }

            return children;
        };

        export default ProtectedRoute;

    Create NavBar : frontend/components/Navbar.jsx
        import { useAuth } from "../context/useAuth";
        import { useNavigate } from "react-router-dom";

        const Navbar = () => {
            const { user, logout } = useAuth();
            const navigate = useNavigate();

            const handleLogout = () => {
                logout();
                navigate('/login');

            };

            return  ( 
                < nav className="flex items-center justify-between border-b p-4">
                    <h1 className="font-bold">
                        MERN Auth
                    </h1>

                    {user && {
                        <div className="flex items-center gap-4">
                            <span>
                                {user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="rounded bg-red-500 px-3 py-2 text-white"
                            >
                            Logout
                            </button>
                        </div> 
                    }}
                </nav>
            );
        };
        export default Navbar;

    Add Navbar to Profile 
        At the top of ProfilePage.jsx:
            import Navbar from "../components/Navbar";

        Then use component using :
            <Navbar />

    ⚠️ There's one problem we haven't solved yet
     - if we refresh the page, react starts from scrach and 'user' useState set to "null"
     - Even through, In localStorage JWT sitll exists 

Level 14.1   Restore authentication after refresh    ( just part of level 14 - refresh token )

    so what we do is :
        on refresh  whole frontend react reloads, user is set to null so we do :

                    
            Browser Refresh (F5)
                ▼
            useEffect(()=>{},[]) is triggered at initialisation to restore token

            AuthProvider mounts with loading = true
                │
                ├── Reads localStorage.getItem("token")
                │
                ├── If NO token:
                │     loading = false (Redirects to /login)
                │
                └── If token EXISTS:
                        Calls GET /profile (backend verifies token credibility)
                        ├── Valid:   setUser(response.data.user)  ──>  State RESTORED!
                        └── Invalid: localStorage.removeItem("token"), setUser(null)
                        Finally: setLoading(false)

    Add an authentication check in AuthProvider.jsx
    frontend/src/context/AuthProvider.jsx 
        import {
            useState,
            useEffect                   // used to check if token exists when react refreshes 
        } from "react";
        import { AuthContext } from "./AuthContext";
        import API from "../services/api";

        export const AuthProvider = ({ children }) => {
            .... ... ... .. . 
            useEffect(() => {
                const restoreAuth = async () => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        setLoading(false);
                        return;
                    }
                    try {
                        const response = await API.get("/profile");         // token need to jwt.verify(), and 
                        setUser(response.data.user);
                    } catch (error) {
                        localStorage.removeItem("token");
                        setUser(null);
                    } finally {
                        setLoading(false);
                    }
                };
                restoreAuth();
                
            }, []);         // The empty array: means Run this effect when the component is initially mounted.

            const isAuthenticated = !!user;

            return (
                <AuthContext.Provider
                    value={{
                        user,
                        login,
                        logout,
                        isAuthenticated,
                        loading                     // Newly added to context
                    }}
                >
                    {children}
                </AuthContext.Provider>
            );
        };

        Update ProtectedRoute    frontend/components/ProtectedRoute.jsx
            import { Navigate } from "react-router-dom";
            import { useAuth } from "../context/useAuth";

            const ProtectedRoute = ({ children }) => {

                const {                                 // load isAuth, loading status from useAuth()
                    isAuthenticated,
                    loading
                } = useAuth();

                if (loading) {                          // display loading on screen till token is Restored 
                    return (
                        <div className="flex min-h-screen items-center justify-center">
                            <p>Checking authentication...</p>
                        </div>
                    );
                }

                if (!isAuthenticated) {                         
                    return <Navigate to="/login" replace />;
                }

                return children;
            };

            export default ProtectedRoute;

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