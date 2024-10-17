import express from "express";
const router = express.Router();
import { getCompanies, createCompany, updateCompany, deleteCompany, getUserCompany, getCompanyStatistics } from "../controllers/companyController.js";


router.get("/company/", getCompanies);
router.get("/company/:id", getCompanies);
router.get("/company/user/:userId", getUserCompany);
router.get("/company/:id/statistics", getCompanyStatistics);
router.post("/company/", createCompany);
router.patch("/company/:id", updateCompany);
router.delete("/company/:id", deleteCompany);

export default router;
