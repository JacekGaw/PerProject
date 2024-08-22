import React, { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext)

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <Outlet/>
    )

}  

export default ProtectedRoute;