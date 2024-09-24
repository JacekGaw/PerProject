import express from "express";
const router = express.Router();
import { createTask, changeTask, deleteTask, getTask } from "../controllers/taskController.js";

router.get("/task/:id", getTask);
router.post("/task", createTask);
router.patch("/task/:id", changeTask);
router.delete("/task/:id", deleteTask);

export default router;
