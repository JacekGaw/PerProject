import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ErrorPage from './pages/ErrorPage';
import RootLayout from './RootLayout';

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <SignUp />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
