import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useCompanyCtx } from "./CompanyContext";
import api from "../api/api";
import { useAuth } from "./AuthContext";

export const projectStatuses = [
  "Active",
  "On Hold",
  "Completed",
  "Archive",
  "Maintaining",
];

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
  deleteProject: (
    projectId: number
  ) => Promise<{ status: string; text: string }>;
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
      const response = await api.post(
        "/api/project",
        data
      );
      if (response.status == 200 || response.status == 201) {
        return { status: "Success", text: "Project Created" };
      } else {
        throw new Error(response.statusText as string);
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
        const response = await api.get(
          `/api/projects?companyId=${company.id}`
        );
        const data = response.data;
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
      const response = await api.patch(
        `/api/project/${projectId}`,
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
        const response = await api.get(
          `/api/dashboard/projects/${company.id}/${user.id}`
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
      return { status: "Error",
        text: "Did not provide all required info to bookmark project",
      };
    }
    try {
      const url = `/api/project/bookmark/${projectId}/${userId}`
      method === "add" ? await api.post(url) : await api.delete(url)
      return { status: "Success", text: "Added/deleted bookmark" };
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      const deletedProject = await api.delete(
        `/api/project/${projectId}`
      );
      if (deletedProject) {
        return {
          status: "Success",
          text: "Project deleted successfully",
        };
      }
      return { status: "Error", text: "Cannot delete project" };
    } catch (err: any) {
      console.error(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const ctxValue = {
    addNewProject,
    getCompanyProjects,
    setProject,
    project,
    bookmarkProject,
    getDashboardProjects,
    changeProject,
    deleteProject,
  };

  return (
    <ProjectsContext.Provider value={ctxValue}>
      {children}
    </ProjectsContext.Provider>
  );
};
