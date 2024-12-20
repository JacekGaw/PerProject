import { RequestHandler } from "express";
import { NewTaskType, NewSubtaskType } from "../services/taskServices.js";
import {
  getTaskFromDB,
  addSubtasksBatchToDB,
  getTasksFromDB,
  getSubtaskFromDB,
  changeTaskInDB,
  deleteSubtaskFromDB,
  addNewTaskToDB,
  deleteTaskFromDB,
  addNewSubtaskToDB,
  changeSubtaskInDB,
} from "../services/taskServices.js";
import { generateSubtasksUsingAI } from "../services/aiServices.js";

export const getTask: RequestHandler = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const data = await getTaskFromDB(parseInt(taskId));
    console.log(data);
    return res.status(200).json({ message: "Getting task data", data: data });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const getSubtask: RequestHandler = async (req, res) => {
  try {
    const { id: subtaskId } = req.params;
    const data = await getSubtaskFromDB(parseInt(subtaskId));
    console.log(data);
    return res
      .status(200)
      .json({ message: "Getting subtask data", data: data });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const generateSubtasks: RequestHandler = async (req, res) => {
  try {
    const task = req.query.task as string;
    const project = req.query.project as string;
    const company = req.query.company as string;
    console.log(task, project, company);
    if (!task || !project || !company) {
      return res
        .status(400)
        .json({ message: "Did not provide all required data" });
    }
    const generatedSubtasks = await generateSubtasksUsingAI(
      parseInt(task),
      parseInt(project),
      parseInt(company)
    );
    return res
      .status(200)
      .json({ message: "Generated subtasks", data: generatedSubtasks });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const getTasks: RequestHandler = async (req, res) => {
  try {
    const { withSubtasks } = req.query;
    const { userId } = req.params;
    const withSubtasksBoolean = withSubtasks === "true";
    const data = await getTasksFromDB(parseInt(userId), withSubtasksBoolean);
    return res.status(200).json({ message: "Getting task data", data: data });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const createTask: RequestHandler = async (req, res) => {
  try {
    const newTask = req.body as NewTaskType;
    const addedTask = await addNewTaskToDB(newTask);
    return res.status(200).json({ message: "Added new task", data: addedTask });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const createSubtask: RequestHandler = async (req, res) => {
  try {
    const batch = req.query.batch === "true";
    console.log(batch);
    if (!batch) {
      const newSubtask = req.body as NewTaskType;
      const addedSubtask = await addNewSubtaskToDB(newSubtask);
      return res
        .status(200)
        .json({ message: "Added new subtask", data: addedSubtask });
    } else {
      const newSubtasks = req.body as NewTaskType[];
      console.log(newSubtasks)
      const addedSubtasks = await addSubtasksBatchToDB(newSubtasks);
      return res
        .status(200)
        .json({ message: "Added new subtask", data: addedSubtasks });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const changeTask: RequestHandler = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const changeTask = req.body as Partial<NewTaskType>;
    const changedTask = await changeTaskInDB(parseInt(taskId), changeTask);
    return res.status(200).json({ message: "Changed task", data: changedTask });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const changeSubtask: RequestHandler = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const changeSubtask = req.body as Partial<NewSubtaskType>;
    const changedSubtask = await changeSubtaskInDB(
      parseInt(taskId),
      changeSubtask
    );
    return res
      .status(200)
      .json({ message: "Changed subtask", data: changedSubtask });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const deletedTask = await deleteTaskFromDB(parseInt(taskId));
    return res.status(200).json({ message: "Deleted task", data: deletedTask });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const deleteSubtask: RequestHandler = async (req, res) => {
  try {
    const { id: subtaskId } = req.params;
    const deletedSubtask = await deleteSubtaskFromDB(parseInt(subtaskId));
    return res
      .status(200)
      .json({ message: "Deleted subtask", data: deletedSubtask });
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};
