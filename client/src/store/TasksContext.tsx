import {
  ReactNode,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useAuth } from "./AuthContext";
import { useCompanyCtx } from "./CompanyContext";
import { Project } from "./ProjectsContext";
import api from "../api/api";

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
  sprintId: number | null;
}

export interface DashboardTaskType extends Partial<Task> {
  projectAlias: string;
}

export interface SubTask extends Partial<Task> {
  taskId: number;
}

export interface TaskWithSubtasks extends Task {
  subTasks: SubTask[];
  project: Partial<Project>;
}

interface TasksContextProps {
  getDashboardTasks: () => Promise<DashboardTaskType[]>;
  getUserTasks: () => Promise<TaskWithSubtasks[]>;
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
  ) => Promise<{ status: string; text: string }>;
  addNewTask: (
    type: "task" | "subtask",
    data: Partial<Task> | Partial<Task>[],
    batch?: boolean
  ) => Promise<{ status: string; text: string }>;
  deleteTask: (
    type: "task" | "subtask",
    id: number
  ) => Promise<{ status: string; text: string }>;
  generateSubtasks: (
    taskId: number,
    projectId: number
  ) => Promise<
    | { status: string; text: string }
    | {
        status: string;
        text: string;
        data: { taskText: string; description: string }[];
      }
  >;
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
  const { company } = useCompanyCtx();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasksArr, setSubtasksArr] = useState<SubTask[]>([]);
  const [userAllTasks, setUserAllTasks] = useState<TaskWithSubtasks[]>([]);

  const getDashboardTasks = async () => {
    try {
      if (!company || !user) {
        return { status: "Error", text: "Company or user is not defined" };
      } else {
        const response = await api.get(
          `/api/dashboard/tasks/${company.id}/${user.id}`
        );
        1;
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
  };

  const getUserTasks = async () => {
    try {
      if (!user) {
        return { status: "Error", text: "User is not defined" };
      } else {
        const response = await api.get(
          `/api/tasks/${user.id}?withSubtasks=true`
        );
        1;
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
  };

  const addNewTask = async (
    type: "task" | "subtask",
    data: Partial<Task> | Partial<Task>[],
    batch?: boolean
  ) => {
    try {
      if (!batch) {
        const response = await api.post(
          `/api/task?type=${type}`,
          data
        );
        if (type === "task") {
          response.data.data &&
            setTasks((prevState) => [...prevState, response.data.data]);
        } else {
          response.data.data &&
            setSubtasksArr((prevState) => [...prevState, response.data.data]);
        }
      } else {
        const response = await api.post(
          "/api/subtask?batch=true",
          data
        );
        response.data.data &&
          setSubtasksArr((prevState) => [...prevState, ...response.data.data]);
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
      const response = await api.patch(
        `/api/change/${type}/${taskId}`,
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
              return { ...task, subTasks: updatedSubTasks };
            }
            return task;
          })
        );
      }
      return { status: "Success", text: response.data.message };
    } catch (err: any) {
      return {
        status: "Error",
        text: err.response?.data.message || err.message,
      };
    }
  };

  const deleteTask = async (type: "task" | "subtask", id: number) => {
    try {
      if (!id) {
        return { status: "Error", text: "Did not provide task id" };
      }
      const response = await api.delete(
        `/api/delete/${type}/${id}`
      );
      const deletedTask = response.data.data;
      type == "task"
        ? setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== deletedTask.id)
          )
        : setSubtasksArr((prevTasks) =>
            prevTasks.filter((task) => task.id !== deletedTask.id)
          );
      return { status: "Success", text: "Task deleted" };
    } catch (err: any) {
      return {
        status: "Error",
        text: err.response?.data.message || err.message,
      };
    }
  };

  const generateSubtasks = async (taksId: number, projectId: number) => {
    try {
      if (!taksId) {
        return { status: "Error", text: "Did not provide task id" };
      }
      const response = await api.get(
        `/api/subtasks/generate?task=${taksId}&project=${projectId}&company=${
          company!.id
        }`
      );
      if (!response.data.data || !response.data.data.subtasks) {
        throw new Error("No subtasks array");
      }
      return {
        status: "Success",
        text: "Generated subtasks",
        data: response.data.data.subtasks,
      };
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
    subtasksArr,
    userAllTasks,
    setUserAllTasks,
    generateSubtasks,
  };

  return (
    <TasksContext.Provider value={ctxValue}>{children}</TasksContext.Provider>
  );
};
