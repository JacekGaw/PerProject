import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

export interface CompanyUserType {
  id: number;
  name?: string | null;
  surname?: string | null;
  email: string;
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  active: boolean;
  joinDate: Date;
}

interface CompanyType {
  id: number,
  name: string,
  description: string,
  createdAt: Date,
  settings: SettingsType
}

interface SettingsType {
  AI: AIDataType
}

export interface AIDataType {
  available: boolean; // Available is a boolean value
  model: string;
  apiKey: string;
}

export interface StatisticsType {
  projects: number;
  tasks: number;
  users: number;
}

export interface AIDataType {
  available: boolean
  model: string
  apiKey: string
}

interface CompanyContextProps {
  isLoading: boolean;
  company: CompanyType | undefined;
  companyUsers: CompanyUserType[];
  getCompanyStatistics: () => Promise<StatisticsType>;
  changeCompanyAISettings: (data: AIDataType) => Promise<{status: string, text: string}>;
  changeCompanyAIAvailability: (changeAvailable: boolean) => Promise<{status: string, text: string}>
}


export const CompanyContext = createContext<CompanyContextProps | undefined>(
  undefined
);

export const useCompanyCtx = (): CompanyContextProps => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanyCtx must be used within an AuthProvider");
  }
  return context;
};

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [company, setCompany] = useState<CompanyType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [companyUsers, setCompanyUsers] = useState<CompanyUserType[]>([]);
  const { user, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const getUserCompany = async () => {
      setIsLoading(true);
      if (!user) {
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3002/api/company/user/${user.id}`
        );
        const data = response.data;
        if (!data) {
          throw new Error("No data in response");
        }

        if (data.data.company) {
          setCompany(data.data.company);
          console.log("Company: ", data.data.company);
        } else {
          setIsAuthenticated(false);
        }
        if (data.data.users) {
          setCompanyUsers(data.data.users);
          console.log("Company Users:", data.data.users);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    getUserCompany();
  }, [user, setIsAuthenticated]);


  const getCompanyStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/company/${company?.id}/statistics`);
      return response.data.data;
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const changeCompanyAISettings = async (data: AIDataType) => {
    try {
      const newSettings = {AI: data}
      const response = await axios.patch(`http://localhost:3002/api/company/${company?.id}/settings/ai`, newSettings);
      console.log(response)
      if(response.status == 200) {
        setCompany((company) => {
          const newData: CompanyType = company!;
          newData.settings = newSettings;
          return newData
        })
        return {status: "Success", text: "Changed Availability"}
      }
      return {status: "Error", text: response?.data.message}
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const changeCompanyAIAvailability = async (changeAvailable: boolean) => {
    try {
      const newSettings = {AI: {available: changeAvailable, model: company!.settings.AI.model, apiKey: company!.settings.AI.apiKey}}
      const response = await axios.patch(`http://localhost:3002/api/company/${company?.id}/settings/ai`, newSettings);
      if(response.status == 200) {
        setCompany((company) => {
          const newData: CompanyType = company!;
          newData.settings.AI.available = changeAvailable;
          return newData
        })
        return {status: "Success", text: "Changed Availability"}
      }
      return {status: "Error", text: response?.data.message}
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const ctxValue = {
    isLoading,
    company,
    companyUsers,
    getCompanyStatistics,
    changeCompanyAISettings,
    changeCompanyAIAvailability
  };

  return (
    <CompanyContext.Provider value={ctxValue}>
      {isLoading ? <></> : children}
    </CompanyContext.Provider>
  );
};
