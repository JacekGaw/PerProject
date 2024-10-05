import { RequestHandler } from "express";
import {getDashboardProjectsFromDB} from '../services/projectServices.js'
import { getDashboardTasksFromDB } from "../services/taskServices.js";


export const getDashboardProjects: RequestHandler = async (req, res) => {
  try {
    const {companyId, userId} = req.params
    if(!companyId || !userId) {
        return res.status(403).json({message: "Did not provide company ID or user ID"});
    }
    const projects = await getDashboardProjectsFromDB(parseInt(companyId), parseInt(userId));
    console.log("Dashboard projects ", projects);
    return res.status(200).json({
      message: "Getting dashboard projects",
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};


export const getDashboardTasks: RequestHandler = async (req, res) => {
  try {
    const {companyId, userId} = req.params
    if(!companyId || !userId) {
        return res.status(403).json({message: "Did not provide company ID or user ID"});
    }
    const tasks = await getDashboardTasksFromDB(parseInt(companyId), parseInt(userId));
    console.log("Dashboard tasks ", tasks);
    return res.status(200).json({
      message: "Getting dashboard tasks",
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};


