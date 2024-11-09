import {
    ReactNode,
    createContext, useContext, useState, Dispatch, SetStateAction  } from "react";
import { useAuth } from "./AuthContext";
import { useCompanyCtx } from "./CompanyContext";
import {Project} from  "./ProjectsContext";
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

export interface DashboardTaskType extends Partial<Task> {
    projectAlias: string,
}

export interface SubTask extends Partial<Task> {
  taskId: number;
}

export interface TaskWithSubtasks extends Task {
  subTasks: SubTask[];
  project: Partial<Project>
}
  
  interface TasksContextProps {
    getDashboardTasks: () => Promise<DashboardTaskType[]>
    getUserTasks: () => Promise<TaskWithSubtasks[]>
    setTasks: Dispatch<SetStateAction<Task[]>>;
    setSubtasksArr: Dispatch<SetStateAction<SubTask[]>>;
    setUserAllTasks: Dispatch<SetStateAction<TaskWithSubtasks[]>>;
    tasks: Task[] | undefined;
    subtasksArr: SubTask[] | undefined;
    userAllTasks: TaskWithSubtasks[] | undefined;
    changeTask: (
      type: "subtask" | "task",
      taskId: number,
      data: Partial<Task>
    ) => Promise<object>;
    addNewTask: (
      type: "task" | "subtask",
      data: Partial<Task> | Partial<Task>[],
      batch?: boolean
    ) => Promise<{ status: string; text: string }>;
    deleteTask: (type: "task" | "subtask", id: number) => Promise<{ status: string; text: string }>;
    generateSubtasks: (taskId: number, projectId: number) => Promise<{status: string, text: string} | {status: string, text: string, data: {taskText: string, description: string}[]}>;
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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subtasksArr, setSubtasksArr] = useState<SubTask[]>([]);
    const [userAllTasks, setUserAllTasks] = useState<TaskWithSubtasks[]>([])

    
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

    const getUserTasks = async () => {
      try {
        if (!user) {
          return { status: "Error", text: "User is not defined" };
        } else {
          const response = await axios.get(
            `http://localhost:3002/api/tasks/${user.id}?withSubtasks=true`
          );1
          console.log("GETTING TASKS with subtask: ", response);
          const data = response.data.data;
          setUserAllTasks(data);
          return data;
        }
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    }


    const addNewTask = async (type: "task" | "subtask", data: Partial<Task> | Partial<Task>[], batch?: boolean) => {
      try {
        const url =
          type === "task"
            ? "http://localhost:3002/api/task"
            : "http://localhost:3002/api/subtask";
        if(!batch) {
          const response = await axios.post(url, data);
          console.log(response);
          if (type === "task") {
            if (response.data.data) {
              setTasks((prevState) => [...prevState, response.data.data]);
            }
          } else {
            if (response.data.data) {
              setSubtasksArr((prevState) => [...prevState, response.data.data]);
            }
          }
        }
        else {
          const response = await axios.post(url+"?batch=true", data);
          if (response.data.data) {
            setSubtasksArr((prevState) => [...prevState, ...response.data.data]); 
          }
        }
        return { status: "Success", text: "Added task" };
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    };

    const changeTask = async (
      type: "task" | "subtask",
      taskId: number,
      data: Partial<Task> | Partial<SubTask>
    ) => {
      try {
        const response = await axios.patch(
          `http://localhost:3002/api/${type}/${taskId}`,
          data
        );
        if (type === "task") {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, ...data } : task
            )
          );
          setUserAllTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, ...data } : task
            )
          );
        } else {
          setSubtasksArr((prevSubTasks) =>
            prevSubTasks.map((subtask) =>
              subtask.id === taskId ? { ...subtask, ...data } : subtask
            )
          );
          setUserAllTasks((prevTasks) =>
            prevTasks.map((task) => {
              if (task.subTasks) {
                const updatedSubTasks = task.subTasks.map((subtask) =>
                  subtask.id === taskId ? { ...subtask, ...data } : subtask
                );
    
                // Return the updated task with modified subtasks
                return { ...task, subTasks: updatedSubTasks };
              }
              return task; // If no subtasks, return the task unchanged
            })
          );
        }
        return { status: "Success", text: response.data.message };
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    };

    const deleteTask = async (type: "task" | "subtask", id: number) => {
      try {
        if (!id) {
          return { status: "Error", text: "Did not provide task id" };
        }
        const url = type == "task" ? `http://localhost:3002/api/task/${id}` : `http://localhost:3002/api/subtask/${id}`;
        const response = await axios.delete(url);
        const deletedTask = response.data.data;
        console.log(deletedTask);
        if(type == "task"){
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== deletedTask.id)
          );
        }
        else {
          setSubtasksArr((prevTasks) =>
            prevTasks.filter((task) => task.id !== deletedTask.id)
          );
        }
        
        return { status: "Success", text: "Task deleted" };
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    };

    const generateSubtasks = async (taksId: number, projectId: number) => {
      try {
        if (!taksId) {
          return { status: "Error", text: "Did not provide task id" };
        }
        const response = await axios.get(
          `http://localhost:3002/api/subtasks/generate?task=${taksId}&project=${projectId}&company=${company!.id}`
        );
        if(!response.data.data || !response.data.data.subtasks) {
          throw new Error("No subtasks array");
        }
        return { status: "Success", text: "Generated subtasks", data:  response.data.data.subtasks};
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    }


    const ctxValue = {
      getDashboardTasks,
      getUserTasks,
      addNewTask,
      changeTask,
      deleteTask,
      setSubtasksArr,
      setTasks,
      tasks,
      subtasksArr,
      userAllTasks,
      setUserAllTasks,
      generateSubtasks
    };
  
    return (
      <TasksContext.Provider value={ctxValue}>
        {children}
      </TasksContext.Provider>
    );
  };
  