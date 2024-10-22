import express from "express";
const router = express.Router();
import { createTask,getSubtask, changeTask, deleteTask, deleteSubtask, getTask, createSubtask, changeSubtask, getTasks } from "../controllers/taskController.js";

router.get("/task/:id", getTask);
router.get("/subtask/:id", getSubtask);
router.get("/tasks/:userId", getTasks);
router.post("/task", createTask);
router.post("/subtask", createSubtask);
router.patch("/subtask/:id", changeSubtask);
router.patch("/task/:id", changeTask);
router.delete("/task/:id", deleteTask);
router.delete("/subtask/:id", deleteSubtask);

export default router;
