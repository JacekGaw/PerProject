import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useCompanyCtx } from "./CompanyContext";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "./AuthContext";

export const projectStatuses = ["Active", "On Hold", "Completed", "Archive", "Maintaining"];

export type ProjectStatus =
  | "Active"
  | "On Hold"
  | "Completed"
  | "Archive"
  | "Maintaining";
type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";
type TaskPriority = "Low" | "Medium" | "High";
type TaskType = "Task" | "Story" | "Error";

export interface SubtaskType {
  id: number;
  taskText: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  type: "Task" | "Story" | "Error";
  priority: "Low" | "Medium" | "High";
  estimatedTime: number | null;
  status: "To Do" | "In Progress" | "On Hold" | "Done";
  assignedTo: number | null;
  authorId: number;
  taskId: number;
}



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
  addNewProject: (
    data: NewProjectType
  ) => Promise<{ status: string; text: string }>;
  getCompanyProjects: () => Promise<Project[]>;
  setProject: Dispatch<SetStateAction<Project | undefined>>;
  project: Project | undefined;
  bookmarkProject: (
    method: "add" | "delete",
    projectId: number,
    userId: number
  ) => Promise<{ status: string; text: string }>;
  getDashboardProjects: () => Promise<Project[]>;
  changeProject: (
    projectId: number,
    data: Partial<Project>
  ) => Promise<{ status: string; text: string }>;
  deleteProject: (projectId: number) => Promise<{status:string, text: string}>
}

export const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

export const useProjectCtx = (): ProjectsContextProps => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error(
      "Project Context must be used within an ProjectContextProvider"
    );
  }
  return context;
};

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { company } = useCompanyCtx();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | undefined>();

  const addNewProject = async (data: NewProjectType) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/api/project",
        data
      );
      if (response.status == 200 || response.status == 201) {
        return { status: "Success", text: "Project Created" };
      } else {
        throw new Error(response.statusText);
      }
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const getCompanyProjects = async () => {
    try {
      if (!company) {
        return { status: "Error", text: "Company is not defined" };
      } else {
        const response = await axios.get(
          `http://localhost:3002/api/projects?companyId=${company.id}`
        );
        const data = response.data;
        console.log(data);
        return data.projects;
      }
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const changeProject = async (projectId: number, data: Partial<Project>) => {
    try {
      const response = await axios.patch(
        `http://localhost:3002/api/project/${projectId}`,
        data
      );
      if (response.data.data) {
        setProject(response.data.data);
      }
      return { status: "Success", text: response.data.message };
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const getDashboardProjects = async () => {
    try {
      if (!company || !user) {
        return { status: "Error", text: "Company or user is not defined" };
      } else {
        const response = await axios.get(
          `http://localhost:3002/api/dashboard/projects/${company.id}/${user.id}`
        );
        console.log("GETTING DASHBOARD: ", response);
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

  const bookmarkProject = async (
    method: "add" | "delete",
    projectId: number,
    userId: number
  ) => {
    if (!projectId || !userId) {
      return {
        status: "Error",
        text: "Did not provide all required info to bookmark project",
      };
    }
    try {
      let response: AxiosResponse;
      if (method === "add")
        response = await axios.post(
          `http://localhost:3002/api/project/bookmark/${projectId}/${userId}`
        );
      else
        response = await axios.delete(
          `http://localhost:3002/api/project/bookmark/${projectId}/${userId}`
        );
      const bookmark = response.data.data;
      console.log("Bookmark from endpoint: ", bookmark);
      return { status: "Success", text: "Added/deleted bookmark" };
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const deleteProject = async (projectId: number) => {
    if (!projectId) {
      return {
        status: "Error",
        text: "Did not provide project ID to delete project",
      };
    }
    try {
      const response: AxiosResponse = await axios.delete(`http://localhost:3002/api/project/${projectId}`);
      if(response.status == 200) {
        return { status: "Success", text: "Deleted project" };
      }
      else {
        throw new Error(response.statusText)
      }
    } catch (err: any){
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  }

  const ctxValue = {
    addNewProject,
    getCompanyProjects,
    setProject,
    project,
    bookmarkProject,
    getDashboardProjects,
    changeProject,
    deleteProject
  };

  return (
    <ProjectsContext.Provider value={ctxValue}>
      {children}
    </ProjectsContext.Provider>
  );
};
