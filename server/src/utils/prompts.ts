
import {
    projects,
    subTasks,
    tasks
  } from "../database/schemas.js";

type Project = typeof projects.$inferSelect;
type Task = typeof tasks.$inferSelect;
type TaskObj = {
    task: Task;
    subtasks: typeof subTasks.$inferSelect[]
}


export const generateSubtasksPrompt = (project: Project, task: TaskObj) => {
    if(!project || !task) {
        return;
    }
    const prompt = {
        systemPrompt: `You are subtasks generator for Project Management App. User will provide all the informations that are needed for generating them. Those informations will be:
        
        Informations about Project:
        - project title
        - project description 

        Informations about Task:
        - task title
        - task description
        - task priority [low, medium, high]
        - task type [story, task, error]

        If there are any, array with current subtasks, where each will have informations:
        - subtask title
        - subtask subtitle
        - subtask priority [low, medium, high]
        - subtask status ["To Do", "In Progress", "On Hold", "Done"]

        Given those informations, generate subtasks that will be helpful for completing the task. Do not change current subtasks if user provide array of them. Take them to account when you will generate yours. 
        Generate as many subtasks as you think is appropriate. Try to make them specific.
        `,
        userPrompt: 
        `
        Project informations:
        - title: ${project.name}
        - description: ${project.description}

        Task informations:
        - title: ${task.task.taskText}
        - description: ${task.task.description}
        - task priority: ${task.task.priority}
        - task type: ${task.task.type}

        Subtasks:
        ${task.subtasks.map((subtask, index) => {
            return (
            `
            Subtask ${index + 1}:
                - title: ${subtask.taskText}
                - description: ${subtask.description}
                - priority: ${subtask.priority}
                - status: ${subtask.status}
            `
            )
        })}

        `
    }
    return prompt;
}