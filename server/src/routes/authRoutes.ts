import express from "express";
import { Router } from "express";
import {logIn} from "../controllers/authController.js"
const router = express.Router();


router.post("/login", logIn);

export default router;
