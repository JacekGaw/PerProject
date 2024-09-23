import { RequestHandler } from "express";
import { NewTaskType } from "../services/taskServices.js";
import { changeTaskInDB, addNewTaskToDB, deleteTaskFromDB } from "../services/taskServices.js";


export const createTask: RequestHandler = async (req,res) => {
    try {
        const newTask = req.body as NewTaskType
        const addedTask = await addNewTaskToDB(newTask);
        return res.status(200).json({message: "Added new task", data: addedTask});
    } catch (err) {
        console.log(err);
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error"
    });
  }
}

export const changeTask: RequestHandler = async (req,res) => {
    try {
        const {id: taskId} = req.params;
        const changeTask = req.body as Partial<NewTaskType>
        const changedTask = await changeTaskInDB(parseInt(taskId), changeTask);
        return res.status(200).json({message: "Changed task", data: changedTask});
    } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error"
    });
  }
}

export const deleteTask: RequestHandler = async (req,res) => {
    try {
        const {id: taskId} = req.params;
        const deletedTask = await deleteTaskFromDB(parseInt(taskId));
        return res.status(200).json({message: "Deleted task", data: deletedTask});
    } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error"
    });
  }
}
