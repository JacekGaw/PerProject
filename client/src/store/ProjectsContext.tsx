import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState
} from "react";
import { useCompanyCtx } from "./CompanyContext";
import axios from "axios";
import { Task } from "../pages/project/ProjectRoot";

type ProjectStatus =
  | "Active"
  | "On Hold"
  | "Completed"
  | "Archive"
  | "Maintaining";
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
}

export interface NewProjectType {
  name: string;
  alias: string;
  description: string;
  startDate?: string | null;
  endDate?: string | null;
  projectManagerId: number;
  authorId: number;
  companyId: number;
}

export interface Project {
  id: number;
  name: string;
  alias: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  authorId: number | null;
  projectManagerId: number | null;
  companyId: number;
}

interface ProjectsContextProps {
  addNewProject: (data: NewProjectType) => Promise<{status: string, text: string}>,
  getCompanyProjects: () => Promise<Project[]>,
  setProject: Dispatch<SetStateAction<Project | undefined>>,
  project: Project | undefined,
  setTasks: Dispatch<SetStateAction<Task[]>>,
  tasks: Task[] | undefined,
  changeTaskStatus: (taskId: number, newStatus: string) => Promise<object>
}

export const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

export const useProjectCtx = () : ProjectsContextProps => {
  const context = useContext(ProjectsContext);
  if(context === undefined) {
    throw new Error("Project Context must be used within an ProjectContextProvider");
  }
  return context;
}

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { company } = useCompanyCtx();
  const [project, setProject] = useState<Project | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);

  const changeTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await axios.patch(`http://localhost:3002/api/task/${taskId}`, {status: newStatus});
      return {status: "Success", text: response.data.message}
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message
      return {status: "Error", text: errMessage};
    }
  }

  const addNewProject = async (data: NewProjectType) =>  {
    try {
      const response = await axios.post("http://localhost:3002/api/project",  data);
      if(response.status == 200 || response.status == 201) {
        return {status: "Success", text: "Project Created"}
      }
      else {
        throw new Error(response.statusText);
      }
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message
      return {status: "Error", text: errMessage};
    }
  }

  const getCompanyProjects = async () => {
    try {
      if(company == undefined){
        return {status: "Error", text: "Company is not defined"};
      }
      else {
      const response = await axios.get(`http://localhost:3002/api/projects?companyId=${company.id}`);
      const data = response.data;
      console.log(data);
      return data.projects;
      }
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message
      return {status: "Error", text: errMessage};
    }
  }

  const ctxValue = {
    addNewProject,
    getCompanyProjects,
    setProject,
    project,
    setTasks,
    tasks,
    changeTaskStatus
  };

  return (
    <ProjectsContext.Provider value={ctxValue}>
      {children}
    </ProjectsContext.Provider>
  );
};
