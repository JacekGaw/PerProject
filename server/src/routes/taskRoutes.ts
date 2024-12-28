import express from "express";
const router = express.Router();
import { createTask,getSubtask,generateSubtasks, changeTask, deleteTask, getTask, createSubtask, changeSubtask, getTasks } from "../controllers/taskController.js";

router.get("/task/:id", getTask);
router.get("/subtask/:id", getSubtask);
router.get("/subtasks/generate", generateSubtasks);
router.get("/tasks/:userId", getTasks);
router.post("/task", createTask);
router.post("/subtask", createSubtask);
router.patch("/subtask/:id", changeSubtask);
router.patch("/task/:id", changeTask);
router.delete("/delete/:type/:id", deleteTask);

export default router;
