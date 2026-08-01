import http from "http";

import express from "express";

const app = express();

app.get("/", (req,res) => {
    res.send("Hello World");
})

const server = http.createServer(app); 

server.listen(3000, () => {
    console.log("server is running at http://localhost:3000/ ")
})
