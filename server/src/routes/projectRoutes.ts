import express from "express";
const router = express.Router();
import {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
  getProjectAndTasks,
  createBookmark,
  deleteBookmark
} from "../controllers/projectController.js";

router.get("/projects/", getProjects);
router.get("/project/:id", getProject);
router.get("/project/:alias/tasks", getProjectAndTasks);
router.post("/project/", createProject);
router.post("/project/bookmark/:projectId/:userId", createBookmark);
router.patch("/project/:id", updateProject);
router.delete("/project/:id", deleteProject);
router.delete("/project/bookmark/:projectId/:userId", deleteBookmark);


export default router;
