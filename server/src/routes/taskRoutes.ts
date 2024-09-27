import express from "express";
const router = express.Router();
import { createTask, changeTask, deleteTask, getTask, createSubtask, changeSubtask } from "../controllers/taskController.js";

router.get("/task/:id", getTask);
router.post("/task", createTask);
router.post("/subtask", createSubtask);
router.patch("/subtask/:id", changeSubtask);
router.patch("/task/:id", changeTask);
router.delete("/task/:id", deleteTask);

export default router;
