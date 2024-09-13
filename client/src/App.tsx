import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./store/AuthContext";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import DashboardRoot from "./pages/dashboard/DashboardRoot";
import MainRoot, {loader as mainLoader} from "./pages/main/MainRoot";
import InitialOnboardingRoot from "./pages/initialOnboarding/InitialOnboardingRoot";

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
              element: <DashboardRoot />
            }
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
