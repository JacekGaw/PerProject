import { RequestHandler } from "express";
import {
  getProjectsFromDB,
  createNewProjectInDB,
  deleteProjectFromDb,
  updateProjectInDB,
} from "../services/projectServices.js";

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const projects = await getProjectsFromDB();
    console.log("All projects ", projects);
    res.status(200).json({
      message: "Getting all projects",
      projects: projects,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const getProject: RequestHandler = async (req, res) => {
  try {
    const projects = await getProjectsFromDB(parseInt(req.params.id));
    console.log("All projects ", projects);
    res.status(200).json({
      message: "Getting project",
      projects: projects,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const createProject: RequestHandler = async (req, res) => {
  try {
    const { name, alias, status, authorId, projectManager, companyId } =
      req.body;
    if (
      !name ||
      !alias ||
      !status ||
      !authorId ||
      !projectManager ||
      !companyId
    ) {
      res.status(400).json({
        message: "Did not provide all requested data for new company",
      });
    }
    const newProject = await createNewProjectInDB(
      name,
      alias,
      status,
      authorId,
      projectManager,
      companyId
    );
    res.status(200).json({
      message: "Created new project",
      project: newProject,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const updateProject: RequestHandler = async (req, res) => {
  try {
    const data = req.body;

    const updatedProject = await updateProjectInDB(
      data,
      parseInt(req.params.id)
    );
    console.log("Updated project ", updatedProject);
    res.status(200).json({
      message: "Updated single project",
      user: updatedProject,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const deletedProject = await deleteProjectFromDb(parseInt(req.params.id));
    console.log("Deleted project ", deletedProject);
    res.status(200).json({
      message: "Deleted single project",
      project: deletedProject,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};
