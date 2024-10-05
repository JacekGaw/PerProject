import {
    ReactNode,
    createContext, useContext  } from "react";
import { useAuth } from "./AuthContext";
import { useCompanyCtx } from "./CompanyContext";
import axios from "axios";

type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";
type TaskPriority = "Low" | "Medium" | "High";
type TaskType = "Task" | "Story" | "Error";

export interface Task {
  id: number;
  taskText: string;
  description: string | null;
  type: TaskType;
  createdAt: Date;
  updatedAt: Date | null;
  priority: TaskPriority;
  estimatedTime: number | null;
  status: TaskStatus;
  assignedTo: number | null;
  projectId: number;
  authorId: number;
}

export interface DashboardTaskType {
  id: number;
  taskText: string;
  description: string | null;
  createdAt: string,
    updatedAt: string | null,
    priority: "Low" | "Medium" | "High",
    estimatedTime: number,
    status: "To Do" | "In Progress" | "On Hold" | "Done";
    projectAlias: string,
}

  
  interface TasksContextProps {
    getDashboardTasks: () => Promise<DashboardTaskType[]>
  }
  
  export const TasksContext = createContext<TasksContextProps | undefined>(
    undefined
  );

  export const useTasksCtx = (): TasksContextProps => {
    const context = useContext(TasksContext);
    if (context === undefined) {
      throw new Error(
        "Tasks Context must be used within an ProjectContextProvider"
      );
    }
    return context;
  };
  
  export const TasksProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const {company} = useCompanyCtx();
    const { user } = useAuth();
    
    const getDashboardTasks = async () => {
      try {
        if (!company || !user) {
          return { status: "Error", text: "Company or user is not defined" };
        } else {
          const response = await axios.get(
            `http://localhost:3002/api/dashboard/tasks/${company.id}/${user.id}`
          );1
          console.log("GETTING TASKS: ", response);
          const data = response.data;
          console.log(data);
          return data.data;
        }
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    }


    const ctxValue = {
      getDashboardTasks
    };
  
    return (
      <TasksContext.Provider value={ctxValue}>
        {children}
      </TasksContext.Provider>
    );
  };
  