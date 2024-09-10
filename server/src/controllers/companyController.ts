import { RequestHandler } from "express";
import {
    getCompaniesFromDB,
    createNewCompanyInDB,
    updateCompanyInDB,
    deleteCompanyFromDb
} from "../services/companyServices.js";


export const getCompanies: RequestHandler = async (req, res) => {
  try {
    const companies = await getCompaniesFromDB(parseInt(req.params.id));
    console.log("All companies ", companies);
    return res.status(200).json({
      message: "Getting project",
      companies: companies,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const createCompany: RequestHandler = async (req, res) => {
  try {
    const { name, description } =
      req.body;
    if (
      !name ||
      !description
    ) {
      return res.status(400).json({
        message: "Did not provide all requested data for new company",
      });
    }
    const newCompany = await createNewCompanyInDB(
      name,
      description
    );
    return res.status(200).json({
      message: "Created new company",
      company: newCompany,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const updateCompany: RequestHandler = async (req, res) => {
  try {
    const data = req.body;

    const updateCompany = await updateCompanyInDB(
      data,
      parseInt(req.params.id)
    );
    console.log("Updated company ", updateCompany);
    return res.status(200).json({
      message: "Updated single company",
      company: updateCompany,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const deleteCompany: RequestHandler = async (req, res) => {
  try {
    const deletedCompany = await deleteCompanyFromDb(parseInt(req.params.id));
    console.log("Deleted project ", deletedCompany);
    return res.status(200).json({
      message: "Deleted single company",
      company: deletedCompany,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};
