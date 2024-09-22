import { RequestHandler } from "express";
import { NewTaskType } from "../services/taskServices.js";
import { changeTaskInDB } from "../services/taskServices.js";


export const createTask: RequestHandler = async (req,res) => {
    try {
        const newTask = req.body as NewTaskType
        console.log(newTask);
        return res.status(200).json({message: "Added new task", data: newTask});
    } catch (err) {
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
        return res.status(200).json({message: "Changed task", data: changeTask});
    } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error"
    });
  }
}
