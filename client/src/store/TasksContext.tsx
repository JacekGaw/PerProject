import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { useAuth } from "./AuthContext";
  import axios from "axios";

  
  interface TasksContextProps {

  }
  
  export const TasksContext = createContext<TasksContextProps | undefined>(
    undefined
  );
  
  export const TasksProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    
    


      
  
    const ctxValue = {
        
    };
  
    return (
      <TasksContext.Provider value={ctxValue}>
        {children}
      </TasksContext.Provider>
    );
  };
  