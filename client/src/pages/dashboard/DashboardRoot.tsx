import React from "react";
import { useAuth } from "../../store/AuthContext";
import Navigation from "../../components/Navigation/Navigation";
import { Navigate, Outlet } from "react-router-dom";
import { UserProvider } from "../../store/UserContext";
import { ProjectsProvider } from "../../store/ProjectsContext";
import { SprintsProvider } from "../../store/SprintsContext";
import { TasksProvider } from "../../store/TasksContext";
import { CompanyProvider } from "../../store/CompanyContext";

const DashboardRoot: React.FC = () => {
  const { isLoading, user } = useAuth();
  if (isLoading) {
    return <></>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <UserProvider>
        <CompanyProvider>
          <ProjectsProvider>
            
              <TasksProvider>
                <SprintsProvider>
                <div className="flex">
                  <Navigation />
                  <main className="p-5 w-full pl-[60px] flex justify-center overflow-x-hidden">
                    <Outlet />
                  </main>
                </div>
                </SprintsProvider>
              </TasksProvider>
            
          </ProjectsProvider>
        </CompanyProvider>
      </UserProvider>
    </>
  );
};

export default DashboardRoot;
