import express from "express";
import {logIn, signUp, refreshToken, verifyToken} from "../controllers/authController.js"
const router = express.Router();
import { protectedRoute } from "../middleware/protectedRoute.js";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts."
  });

router.post("/login", limiter, logIn);
router.post("/signup", signUp);
router.post("/refreshToken", refreshToken);
router.get("/verifyToken", protectedRoute, verifyToken);

export default router;
