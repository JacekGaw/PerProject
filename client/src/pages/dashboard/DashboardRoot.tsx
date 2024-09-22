import React from "react";
import { useAuth } from "../../store/AuthContext";
import Navigation from "../../components/Navigation/Navigation";
import { Navigate, Outlet } from "react-router-dom";
import { UserProvider } from "../../store/UserContext";
import { ProjectsProvider } from "../../store/ProjectsContext";
import { NotesProvider } from "../../store/NotesContext";
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
            <NotesProvider>
              <TasksProvider>
                <div className="flex">
                  <Navigation />
                  <main className="p-5 w-full ml-[60px]">
                    <Outlet />
                  </main>
                </div>
              </TasksProvider>
            </NotesProvider>
          </ProjectsProvider>
        </CompanyProvider>
      </UserProvider>
    </>
  );
};

export default DashboardRoot;
