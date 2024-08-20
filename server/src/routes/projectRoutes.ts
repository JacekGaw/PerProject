import express from "express";
const router = express.Router();
import {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";

router.get("/projects/", getProjects);
router.get("/projects/:id", getProject);
router.post("/projects/", createProject);
router.patch("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

export default router;
