import { RequestHandler } from "express";
import { addNewSprintToDB, assignTasksToSprint } from "../services/sprintServices.js";


type SprintResponse = {
    sprint: {
      id: number;
      name: string;
      target: string | null;
      dateFrom: string | null;
      dateTo: string | null;
      status: "Planning" | "Active" | "Completed";
      created: Date | null;
      projectId: number;
    };
    tasks?: {}[];
  };


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