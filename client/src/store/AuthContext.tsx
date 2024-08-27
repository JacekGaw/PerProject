import { ReactNode, createContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<object>();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      console.log(token);
      if (token) {
        try {
          // Verify the token with your backend
          const response = await axios.get("http://localhost:3002/auth/verifyToken", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data) {
            console.log(response.data);
            setIsAuthenticated(true);
          } else {
            // If the token is invalid, remove it
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          // If there's an error, assume the token is invalid
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (userData: LoginCredentials) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/auth/login",
        userData
      );
      const {accessToken, refreshToken} = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setIsAuthenticated(true);
      return { success: true, message: "Login successful!" };
    } catch (err: any) {
        console.log(err);
      setIsAuthenticated(false);
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
  };

  const signup = async (newUserData: SignUpCredentials) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/auth/signup",
        newUserData
      );
      return { success: true, message: "Successfully created an user" };
    } catch (err: any) {
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
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};
