import express from "express";
import { Router } from "express";
import {logIn, signUp, refreshToken, verifyToken} from "../controllers/authController.js"
const router = express.Router();
import { protectedRoute } from "../middleware/protectedRoute.js";


router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/refreshToken", refreshToken);
router.get("/verifyToken", protectedRoute, verifyToken);

export default router;
