import {
    ReactNode,
    createContext
  } from "react";
  import { useAuth } from "./AuthContext";

  interface UserObj {
    id: number;
    name: string;
    surname: string;
    admin: boolean;
    active: boolean;
    email: string;
    phone?: string;
    createdAt: string;
    role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  }
  
  interface UserContextProps {
    user: UserObj | undefined,

  }
  
  export const UserContext = createContext<UserContextProps | undefined>(
    undefined
  );
  
  export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const { user } = useAuth();
    
    


      
  
    const ctxValue = {
        user
    };
  
    return (
      <UserContext.Provider value={ctxValue}>
        {children}
      </UserContext.Provider>
    );
  };
  