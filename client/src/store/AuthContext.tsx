import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";

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

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    userData: LoginCredentials
  ) => Promise<{ success: boolean; message: string }>;
  signup: (
    newUserData: SignUpCredentials
  ) => Promise<{ success: boolean; message: string }>;
  logOut: () => void;
  user: UserObj | undefined
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  name: string;
  surname: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserObj>();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await api.get("http://localhost:3002/auth/verifyToken", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data) {
            setUser(response.data.user); // Set user data if available
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsLoading(false); // Ensure loading is set to false
    };
  
    checkAuthStatus();
  }, []);
  

  const login = async (userData: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.post(
        "http://localhost:3002/auth/login",
        userData
      );
      const {accessToken, refreshToken} = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return { success: true, message: "Login successful!" };
    } catch (err: any) {
        console.log(err);
      setIsAuthenticated(false);
      setIsLoading(false);
      let errorMessage = "An error occurred during login.";

      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }

      return { success: false, message: errorMessage };
    }
  };

  const logOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(undefined)
  };

  const signup = async (newUserData: SignUpCredentials) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3002/auth/signup",
        newUserData
      );
      console.log(response);
      setIsLoading(false);
      return { success: true, message: "Successfully created an user" };
    } catch (err: any) {
      setIsLoading(false);
      let errMessage = "Did not created new user";
      if (err.response && err.response.data && err.response.data.message) {
        errMessage = err.response.data.message;
      }
      return { success: false, message: errMessage };
    }
  };

  const ctxValue = {
    isAuthenticated,
    isLoading,
    login,
    logOut,
    signup,
    user
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};
