import express from "express";
import { Router } from "express";
import {logIn, signUp, refreshToken} from "../controllers/authController.js"
const router = express.Router();


router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/refreshToken", refreshToken);

export default router;
