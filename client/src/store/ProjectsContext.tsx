import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

interface ProjectsContextProps {}

export const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {

    

  const ctxValue = {};

  return (
    <ProjectsContext.Provider value={ctxValue}>
      {children}
    </ProjectsContext.Provider>
  );
};
