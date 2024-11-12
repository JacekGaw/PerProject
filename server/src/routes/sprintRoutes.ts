import express from "express";
const router = express.Router();
import { addNewSprint, deleteSprint, updateSprint } from "../controllers/sprintController.js";

router.post("/sprint", addNewSprint);
router.patch("/sprint/:id", updateSprint);
router.delete("/sprint/:id", deleteSprint);


export default router;
