import { RequestHandler } from "express";
import {
  addNewSprintToDB,
  assignTasksToSprint,
  deleteSprintFromDB,
  updateSprintInDB,
  endSprintInDB
} from "../services/sprintServices.js";
import { generateRetro } from "../services/aiServices.js"

type SprintResponse = {
  sprint: SprintType;
  tasks?: {}[];
};

interface SprintType {
  id: number;
  name: string;
  target: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  status: "Planning" | "Active" | "Completed";
  created: Date | null;
  projectId: number;
}

export const addNewSprint: RequestHandler = async (req, res) => {
  try {
    const { tasks, ...rest } = req.body;
    const sprintData = rest;
    const newSprint = await addNewSprintToDB(sprintData);

    // Explicitly type dataToReturn
    let dataToReturn: SprintResponse = {
      sprint: newSprint,
    };

    if (newSprint && tasks.length > 0) {
      const tasksAddedToSprint = await assignTasksToSprint(newSprint.id, tasks);
      dataToReturn = { tasks: tasksAddedToSprint, ...dataToReturn };
      console.log(tasksAddedToSprint);
    }
    console.log("All projects ", newSprint);
    res.status(200).json({
      message: "Sprint created successfully",
      data: dataToReturn,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const deleteSprint: RequestHandler = async (req, res) => {
  try {
    const sprintId = req.params.id as unknown as number;

    const deletedSprint = await deleteSprintFromDB(sprintId);

    res.status(200).json({
      message: "Sprint deleted successfully",
      data: deletedSprint,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const updateSprint: RequestHandler = async (req, res) => {
  try {
    const sprintData = req.body as Partial<SprintType>;
    const sprintId = req.params.id as unknown as number;

    const updatedSprint = await updateSprintInDB(sprintId, sprintData);
    return res.status(200).json({
      message: "Sprint updated successfully",
      data: updatedSprint,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};


export const endSprint: RequestHandler = async (req, res) => {
    try {
      const sprintId = req.params.id as unknown as number;
      const tasksAction = req.query.tasksAction as unknown as "done" | "backlog";
      const retro = req.query.tasksAction as unknown as boolean;
      const company = req.query.company as unknown as number;
      const project = req.query.project as unknown as number;
      console.log("TasksAction", tasksAction, " Retro:", retro, " Company: ", company, " Project:", project)
      let retroData: string | null = null
    if(retro) {
        retroData = await generateRetro(sprintId, project, company);
        console.log(retroData)
    }
      const endedSprint = await endSprintInDB(sprintId, tasksAction);
      return res.status(200).json({
        message: "Sprint updated successfully",
        data: {sprint: endedSprint, retro: retroData },
      });
    } catch (err) {
      res.status(500).json({
        message: "Error",
        error: (err as Error).message || "Unknown error",
      });
    }
  };
  
