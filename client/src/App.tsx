import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./store/AuthContext";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import DashboardRoot from "./pages/dashboard/DashboardRoot";
import MainRoot, {loader as mainLoader} from "./pages/main/MainRoot";
import InitialOnboardingRoot from "./pages/initialOnboarding/InitialOnboardingRoot";
import ProjectsRoot from "./pages/projects/ProjectsRoot";
// import NotesRoot from "./pages/notes/NotesRoot";
import TasksRoot from "./pages/tasks/TasksRoot";
import CompanyRoot from "./pages/company/CompanyRoot";
import ProjectRoot, {projectLoader} from "./pages/project/ProjectRoot";
import TaskModal, {taskLoader} from "./pages/project/TaskModal";
import Dashboard from "./pages/dashboard/Dashboard";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          loader: mainLoader,
          element: <MainRoot />
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/start",
          element: <InitialOnboardingRoot />
        },
        {
          path: "/dashboard",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/dashboard",
              element: <DashboardRoot />,
              children: [
                {
                  path: "/dashboard/",
                  element: <Dashboard />
                },
                {
                  path: "/dashboard/projects",
                  element: <ProjectsRoot />
                },
                {
                  path: "/dashboard/projects/:alias",
                  loader: projectLoader,
                  element: <ProjectRoot />,
                  children: [
                    {
                      path: "task/:id",
                      loader: taskLoader,
                      element: <TaskModal />
                    }
                  ]
                },
                // {
                //   path: "/dashboard/notes",
                //   element: <NotesRoot />
                // },
                {
                  path: "/dashboard/tasks",
                  element: <TasksRoot />
                },
                {
                  path: "/dashboard/company",
                  element: <CompanyRoot />
                }
              ]
            },
            
          ]
        }
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
