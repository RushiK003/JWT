import express from "express";
// const experss = require("express");
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", authController)
// router.post("/login", (req, res) => {
//     res.json({
//         message : "Login route working"
//     });
    
// });

// module.exports = router;   // Commonjs
export default router;