
import {
    projects,
    subTasks,
    tasks,
    sprints
  } from "../database/schemas.js";

type Project = typeof projects.$inferSelect;
type Task = typeof tasks.$inferSelect;
type Sprint = typeof sprints.$inferSelect;
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
        Generate as many subtasks as you think is appropriate. Try to make them specific. If current subtasks cover the range to complete the task then do not generate more by force
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

export const generateRetroPrompt = (project: Project, sprint: Sprint, tasks: Task[]) => {
    if(!project || !sprint || !tasks){
        return null;
    }
    const prompt = {
        systemPrompt: `You are a Sprint Retrospective Generator for a Project Management App. Your role is to generate a detailed sprint retrospective based on data provided by the user.

        The user will provide the following data:
        
        Project Info:
        - Project Title
        - Project Description
        
        Sprint Info:
        - Sprint Name
        - Sprint Target
        - Planned Sprint Start Date
        - Planned Sprint End Date
        
        Tasks Info (an array of tasks where each task includes):
        - Task Title
        - Task Description
        - Task Status (e.g., completed, in progress)
        - Task Priority (e.g., high, medium, low)
        - Task Type (e.g., feature, bug, enhancement)
        - Task Estimated Time
        
        Using this information, your retrospective should include:
        
        1. **Achievements & Completed Work:** Summarize the tasks completed during the sprint, highlighting key accomplishments and contributions to the sprint target.
        
        2. **In-Progress & Incomplete Work:** Identify tasks that remain in progress or were not completed, along with possible reasons or contributing factors (e.g., high task complexity, resource allocation).
        
        3. **Reflection on Sprint Goals:** Assess the overall progress towards the sprint target and whether the main objectives were met, partially met, or require more time.
        
        4. **Suggestions for Improvement:** Provide constructive suggestions to improve workflow, prioritization, or team focus in future sprints based on the data provided.
        
        Use the provided data to create an insightful retrospective that is practical, balanced, and reflective, helping the team recognize achievements and identify areas for improvement in future sprints.
        Generate it as Markdown.
        `,
        userPrompt: `
        Project informations:
        - title: ${project.name}
        - description: ${project.description}

        Sprint information:
        - name: ${sprint.name}
        - target: ${sprint.target}

        Tasks informations:
        ${tasks.map((task: Task, index) => {
            return (
            `
            Task ${index + 1}:
                - title: ${task.taskText}
                - description: ${task.description}
                - status: ${task.status}
                - priority: ${task.priority}
                - type: ${task.type}
                - estimated time: ${task.estimatedTime}   
            `
            )
        })}
        `
    }
    return prompt;
}