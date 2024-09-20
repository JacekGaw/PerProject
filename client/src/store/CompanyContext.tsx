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
    const [company, setCompany] = useState<object>({})
    const [companyUsers, setCompanyUsers] = useState<object[]>([])
    const { user, setIsAuthenticated } = useAuth();
    console.log(user);

    useEffect(() => {
      const getUserCompany = async () => {
        if(!user){
          return;
        }
        try {
          const response = await axios.get(`http://localhost:3002/api/company/user/${user.id}`);
          const data = response.data;
          if(!data) {
            throw new Error("No data in response")
          }
          if(data.data[0]){
            setCompany(data.data[0]);
          }
          else{
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.log(err);
          setIsAuthenticated(false);
        }
      }
      getUserCompany();
    }, [user, setIsAuthenticated])
    
    


      
  
    const ctxValue = {
        
    };
  
    return (
      <CompanyContext.Provider value={ctxValue}>
        {children}
      </CompanyContext.Provider>
    );
  };
  