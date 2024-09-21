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
router.get("/project/:id", getProject);
router.post("/project/", createProject);
router.patch("/project/:id", updateProject);
router.delete("/project/:id", deleteProject);

export default router;
