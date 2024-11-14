import { eq } from "drizzle-orm";
import db from "../database/db.js";
import {
  projects,
  companies,
  sprints,
  tasks,
  subTasks
} from "../database/schemas.js";
import { getTaskFromDB } from "./taskServices.js";
import OpenAI from "openai";
import { decryptData } from "../utils/encryption.js";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { generateSubtasksPrompt, generateRetroPrompt } from "../utils/prompts.js";
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
    const model = companySettings.AI.model;
    if(!client) {
        throw new Error("Client not initialized")
    }
    return {
        client,
        model
    };
}

export const testConfig = async (companyId: number): Promise<object> =>  {
    try {
        const openAIClient = await initializeOpenAI(companyId);
        const response = await openAIClient.client.chat.completions.create({
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
  ): Promise<{} | null> => {
    try {
      
      const projectData = await db.select().from(projects).where(eq(projects.id, project));
      const taskData = await getTaskFromDB(task);
      const openAIClient = await initializeOpenAI(company);
      const prompt = generateSubtasksPrompt(projectData[0], taskData);
      if(!prompt) {
        throw new Error("Could not build prompt");
      }
      const completion = await openAIClient.client.beta.chat.completions.parse({
        model: openAIClient.model,
        messages: [
          { role: "system", content: prompt.systemPrompt},
          { role: "user", content: prompt.userPrompt },
        ],
        response_format: zodResponseFormat(SubtasksResponseType, "subtask"),
      });
      
      const subtasks = completion.choices[0].message.parsed;
        return subtasks
    } catch (err) {
      console.error("Error trying to generate subtasks", err);
      throw err;
    }
  };

export const generateRetro = async (sprintId: number,project: number, company: number): Promise<string | null> => {
  try {
    const sprint = await db.select().from(sprints).where(eq(sprints.id, sprintId));
    const sprintTasks = await db.select().from(tasks).where(eq(tasks.sprintId, sprintId));
    const projectData = await db.select().from(projects).where(eq(projects.id, project));
    const openAIClient = await initializeOpenAI(company);
    const prompt = generateRetroPrompt(projectData[0], sprint[0], sprintTasks);
    if(!prompt) {
      throw new Error("Could not build prompt");
    }
    const completion = await openAIClient.client.chat.completions.create({
      model: openAIClient.model,
      messages: [
        { role: "system", content: prompt.systemPrompt},
        { role: "user", content: prompt.userPrompt },
      ]
    });
    
    const generatedRetro = completion.choices[0].message.content as unknown as string;
      return generatedRetro
  } catch (err) {
    console.error("Error trying generate retro", err);
    throw err;
  }
};
