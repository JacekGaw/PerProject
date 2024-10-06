import {
    ReactNode,
    createContext, useContext, useState, Dispatch, SetStateAction  } from "react";
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

export interface DashboardTaskType extends Partial<Task> {
    projectAlias: string,
}

export interface SubTask extends Partial<Task> {
  taskId: number;
}

export interface TaskWithSubtasks extends Task {
  subTasks: SubTask[];
}
  
  interface TasksContextProps {
    getDashboardTasks: () => Promise<DashboardTaskType[]>
    getUserTasks: () => Promise<TaskWithSubtasks[]>
    setTasks: Dispatch<SetStateAction<Task[]>>;
    setSubtasksArr: Dispatch<SetStateAction<SubTask[]>>;
    tasks: Task[] | undefined;
    subtasksArr: SubTask[] | undefined;
    changeTask: (
      type: "subtask" | "task",
      taskId: number,
      data: Partial<Task>
    ) => Promise<object>;
    addNewTask: (
      type: "task" | "subtask",
      data: Partial<Task>
    ) => Promise<{ status: string; text: string }>;
    deleteTask: (id: number) => Promise<{ status: string; text: string }>;
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

    const addNewTask = async (type: "task" | "subtask", data: Partial<Task>) => {
      try {
        const url =
          type === "task"
            ? "http://localhost:3002/api/task"
            : "http://localhost:3002/api/subtask";
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
        } else {
          setSubtasksArr((prevSubTasks) =>
            prevSubTasks.map((subtask) =>
              subtask.id === taskId ? { ...subtask, ...data } : subtask
            )
          );
        }
        return { status: "Success", text: response.data.message };
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    };

    const deleteTask = async (id: number) => {
      try {
        if (!id) {
          return { status: "Error", text: "Did not provide task id" };
        }
        const response = await axios.delete(
          `http://localhost:3002/api/task/${id}`
        );
        const deletedTask = response.data.data;
        console.log(deletedTask);
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== deletedTask.id)
        );
        return { status: "Success", text: "Task deleted" };
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    };


    const ctxValue = {
      getDashboardTasks,
      getUserTasks,
      addNewTask,
      changeTask,
      deleteTask,
      setSubtasksArr,
      setTasks,
      tasks,
      subtasksArr
    };
  
    return (
      <TasksContext.Provider value={ctxValue}>
        {children}
      </TasksContext.Provider>
    );
  };
  