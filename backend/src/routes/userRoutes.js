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