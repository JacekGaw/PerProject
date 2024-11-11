import { RequestHandler } from "express";
import {
  getProjectsFromDB,
  getProjectFromDB,
  CreateProjectBody,
  checkProjectExists,
  createNewProjectInDB,
  deleteProjectFromDb,
  updateProjectInDB,
  getProjectByAlias,
  getTasksFromProject,
  createBookmarkInDB,
  deleteBookmarkInDB,
  getTasksFromProjectAndSprints
} from "../services/projectServices.js";
import { getSprintsByProjectId } from "../services/sprintServices.js";

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const companyId = req.query.companyId as string | undefined;

    const projects = await getProjectsFromDB(companyId);
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
    const projects = await getProjectFromDB(parseInt(req.params.id));
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

export const getProjectAndTasks: RequestHandler = async (req, res) => {
  try {
    const project = await getProjectByAlias(req.params.alias);
    if (!project) {
      return res
        .status(404)
        .json({ message: "Could not find project with provided alias" });
    }
    const sprints = await getSprintsByProjectId(project.id);
    const tasks = await getTasksFromProjectAndSprints(project.id);
    console.log(project, tasks, sprints);
    return res
      .status(201)
      .json({ message: "Getting project, tasks and sprints", data: { project, tasks, sprints } });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const createProject: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      alias,
      description,
      status,
      startDate,
      endDate,
      authorId,
      projectManagerId,
      companyId,
    } = req.body as CreateProjectBody;

    // Validate required fields
    if (!name || !alias || !companyId) {
      return res.status(400).json({
        message: "Name, alias, and companyId are required",
      });
    }

    // Check if project with this alias already exists
    const projectExists = await checkProjectExists(alias);
    if (projectExists) {
      return res.status(409).json({
        message: "A project with this alias already exists",
      });
    }

    const newProject = await createNewProjectInDB({
      name,
      alias,
      description,
      status,
      startDate,
      endDate,
      authorId,
      projectManagerId,
      companyId,
    });

    res.status(201).json({
      message: "Created new project",
      project: newProject,
    });
  } catch (err) {
    console.error("Error creating new project:", err);
    res.status(500).json({
      message: "An error occurred while creating the project",
      error: (err as Error).message,
    });
  }
};

export const createBookmark: RequestHandler = async (req, res) => {
  const { projectId, userId } = req.params;
  try {
    const bookmark = await createBookmarkInDB(parseInt(projectId), parseInt(userId));
    console.log("Added bookmark to db: ", bookmark);
    res.status(201).json({
      message: "Added new bookmark",
      data: bookmark,
    });
  } catch (err) {
    console.error("Error creating new bookmark:", err);
    res.status(500).json({
      message: "An error occurred while creating new bookmark",
      error: (err as Error).message,
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
      data: updatedProject,
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
      data: deletedProject,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const deleteBookmark: RequestHandler = async (req, res) => {
  const { projectId, userId } = req.params;
  try {
    const deletedBookmark = await deleteBookmarkInDB(parseInt(projectId), parseInt(userId));
    console.log("Deleted bookmark from db: ", deletedBookmark);
    res.status(201).json({
      message: "Deleted bookmark",
      data: deletedBookmark,
    });
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    res.status(500).json({
      message: "An error occurred while deleting bookmark",
      error: (err as Error).message,
    });
  }
};
