import React, { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const authContext = useContext(AuthContext);
    
    if (!authContext) {
        throw new Error("AuthContext is undefined");
    }

    const { isAuthenticated, isLoading } = authContext;

    if (isLoading) {
        return <div>Loading...</div>; // Or a loading spinner component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;