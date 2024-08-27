import express from "express";
const router = express.Router();
import { getCompanies, createCompany, updateCompany, deleteCompany } from "../controllers/companyController.js";


router.get("/company/", getCompanies);
router.get("/company/:id", getCompanies);
router.post("/company/", createCompany);
router.patch("/company/:id", updateCompany);
router.delete("/company/:id", deleteCompany);

export default router;
