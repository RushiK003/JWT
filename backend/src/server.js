import http from "http";
import cors from "cors"
import express from "express";
import authRoutes from "./routes/authRoutes.js"

const app = express();

app.use(cors({
    // cors => "I only allow requests coming from http://localhost:5173."
    // origin: "http://localhost:5173/"
}));

// below middleware helps to parse(Break down) incoming HTTP request bodies with JSON payloads.
app.use(express.json()); 

app.use("/", authRoutes);
// app.post("/login", (req, res) => {
//     const { email, password } = req.body;
//     // console.log(req.body)
//     if (
//         email === "admin@gmail.com" &&
//         password === "123456"
//     ) {
//         return res.json({
//             message: "Login Successful"
//         });
//     }
//     return res.status(401).json({
//         message: "Invalid Credentials"
//     });
// });


const server = http.createServer(app); 

server.listen(3000, () => {
    console.log("server is running at http://localhost:3000/ ")
})

// Routes files decide "Which function should run?" then direct to that function

// Controllers files contain the main logic.

// Services files contain reusable business logic.

// Think of middleware as a security checkpoint. Middleware runs before the controller(main logic).
// If middleware rejects the request, the controller never runs.