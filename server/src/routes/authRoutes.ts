import express from "express";
import {logIn, signUp, refreshToken, verifyToken} from "../controllers/authController.js"
const router = express.Router();
import { protectedRoute } from "../middleware/protectedRoute.js";
import { limiter } from "../middleware/rateLimit.js";

router.post("/login", limiter, logIn);
router.post("/signup", signUp);
router.post("/refreshToken", refreshToken);
router.get("/verifyToken", protectedRoute, verifyToken);

export default router;
