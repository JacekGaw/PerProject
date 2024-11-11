import express from "express";
const router = express.Router();
import { addNewSprint } from "../controllers/sprintController.js";

router.post("/sprint", addNewSprint);


export default router;
