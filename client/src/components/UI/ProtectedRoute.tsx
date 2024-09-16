import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute: React.FC<object> = () => {
    const authContext = useAuth();
    
    if (!authContext) {
        throw new Error("AuthContext is undefined");
    }

    const { isAuthenticated, isLoading } = authContext;

    if (isLoading) {
        return  <div className="w-full h-full min-h-screen flex justify-center items-center">
            <Spinner />
        </div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;