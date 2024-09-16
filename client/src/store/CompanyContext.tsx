import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { useAuth } from "./AuthContext";
  import axios from "axios";

  
  interface CompanyContextProps {

  }
  
  export const CompanyContext = createContext<CompanyContextProps | undefined>(
    undefined
  );
  
  export const CompanyProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    
    


      
  
    const ctxValue = {
        
    };
  
    return (
      <CompanyContext.Provider value={ctxValue}>
        {children}
      </CompanyContext.Provider>
    );
  };
  