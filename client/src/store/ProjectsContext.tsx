import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCompanyCtx } from "./CompanyContext";
import axios from "axios";

interface NewProjectType {
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
  createdAt: string;
  alias: string;
  description: string;
  startDate?: string | null;
  endDate?: string | null;
  projectManagerId: number;
  authorId: number;
  companyId: number;
  status: "Active" | "On Hold" | "Completed" | "Archive" | "Maintaining";
}

interface ProjectsContextProps {
  addNewProject: (data: NewProjectType) => Promise<{status: string, text: string}>,
  getCompanyProjects: () => Promise<Project[]>
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
  const { company} = useCompanyCtx();

  const addNewProject = async (data: NewProjectType) =>  {
    try {
      const response = await axios.post("http://localhost:3002/api/project", data);
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
      const response = await axios.get(`http://localhost:3002/api/projects?companyId=${company.id}`);
      const data = response.data;
      console.log(data);
      return data.projects;
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message
      return {status: "Error", text: errMessage};
    }
  }

  const ctxValue = {
    addNewProject,
    getCompanyProjects
  };

  return (
    <ProjectsContext.Provider value={ctxValue}>
      {children}
    </ProjectsContext.Provider>
  );
};
