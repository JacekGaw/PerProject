import { eq } from "drizzle-orm";
import db from "../database/db.js";
import {
  projects,
  companies
} from "../database/schemas.js";
import { getTaskFromDB } from "./taskServices.js";
import OpenAI from "openai";
import { decryptData } from "../utils/encryption.js";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

type CompanySettings = { AI: { available: boolean; model: string; apiKey: string } };

const SubtaskType = z.object({
    taskText: z.string(),
    description: z.string(),
  });

const SubtasksArrType = z.array(
    SubtaskType
)

const SubtasksResponseType = z.object({
    subtasks: SubtasksArrType,
  });


const initializeOpenAI = async (companyId: number) => {
    const company = await db.query.companies.findFirst({where: eq(companies.id, companyId)});
    if(!company) {
        throw new Error("No company found")
    }
    const companySettings: CompanySettings = company.settings as CompanySettings;
    
    const client = new OpenAI({apiKey: decryptData(companySettings.AI.apiKey)})
    if(!client) {
        throw new Error("Client not initialized")
    }
    return client;
}

export const testConfig = async (companyId: number): Promise<object> =>  {
    try {
        const openAIClient = await initializeOpenAI(companyId);
        const response = await openAIClient.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-4o-mini'
        });
        
        console.log(response._request_id);
        if(!response._request_id){
            throw new Error("Config not ok")
        }
        return {message: "Success"}
        
      } catch (err) {
        console.error("Error", err);
        throw err;
      }
}




export const generateSubtasksUsingAI = async (
    task: number,
    project: number,
    company: number
  ): Promise<object> => {
    try {
      
      const projectData = await db.select().from(projects).where(eq(projects.id, project));
      const taskData = await getTaskFromDB(task);
      const openAIClient = await initializeOpenAI(company);
      const completion = await openAIClient.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: "You are a subtasks generator for it company. Generate subtasks for provided project and task" },
          { role: "user", content: "In this project we are doing website for vet. My current task is to create project of the UI" },
        ],
        response_format: zodResponseFormat(SubtasksResponseType, "subtask"),
      });
      
      const subtasks = completion.choices[0].message.parsed;
      console.log(subtasks)
    return {output: subtasks}
    } catch (err) {
      console.error("Error trying to add task to db", err);
      throw err;
    }
  };