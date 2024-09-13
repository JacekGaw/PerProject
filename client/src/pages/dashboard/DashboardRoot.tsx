import React from "react";
import { useAuth } from "../../store/AuthContext";
import Button from "../../components/UI/Button";
import Navigation from "../../components/Navigation/Navigation";
import { Navigate } from "react-router-dom";

const DashboardRoot: React.FC = () => {
    const {logOut, isLoading, user} = useAuth();
    if(isLoading) {
        return <h1>Ty kurwo</h1>;
    }
    if(!user) {
        return  <Navigate to="/login" />
    }
    return (
        <>
            <div className="flex">
            <Navigation />
            <main>
            <h1>Hello User!</h1>
            <Button onClick={() => logOut()}>Log Out</Button>
            </main>
            </div>            
        </>
    )
}

export default DashboardRoot