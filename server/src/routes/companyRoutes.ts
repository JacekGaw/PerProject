import express from "express";
const router = express.Router();
import { getCompanies, createCompany, updateCompanyAISettings, updateCompany, deleteCompany, getUserCompany, getCompanyStatistics } from "../controllers/companyController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";


router.get("/company/", getCompanies);
router.get("/company/:id", getCompanies);
router.get("/company/user/:userId", getUserCompany);
router.get("/company/:id/statistics", protectedRoute, getCompanyStatistics);
router.post("/company/", createCompany);
router.patch("/company/:id", updateCompany);
router.patch("/company/:id/settings/ai", updateCompanyAISettings);
router.delete("/company/:id", deleteCompany);

export default router;
