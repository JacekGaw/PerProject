import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { useAuth } from "./AuthContext";
  import axios from "axios";

  
  interface NotesContextProps {

  }
  
  export const NotesContext = createContext<NotesContextProps | undefined>(
    undefined
  );
  
  export const NotesProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    
    


      
  
    const ctxValue = {
        
    };
  
    return (
      <NotesContext.Provider value={ctxValue}>
        {children}
      </NotesContext.Provider>
    );
  };
  