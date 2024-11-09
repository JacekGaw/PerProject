
import {
    projects,
    tasks
  } from "../database/schemas.js";

type Project = typeof projects.$inferSelect;
type Task = typeof tasks.$inferSelect;

export const generateSubtasksPrompt = (project: Project, task: Task) => {
    if(!project || !task) {
        return;
    }
    const prompt = ``
    return prompt;
}