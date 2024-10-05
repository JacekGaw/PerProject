import express from "express";
const router = express.Router();
import { getDashboardProjects, getDashboardTasks} from "../controllers/dashboardController.js"

router.get("/projects/:companyId/:userId", getDashboardProjects);
router.get("/tasks/:companyId/:userId", getDashboardTasks);


export default router;
