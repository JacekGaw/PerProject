import React, { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import Button from "../../components/UI/Button";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    const data = {
      email,
      password,
    };

    if (login) {
      const result = await login(data);
      if (result.success) {
        navigate("/dashboard");
        console.log("User logged in successfully");
      } else {
        setErrorMessage(result.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <div className="bg-darkest-blue rounded-xl shadow-xl p-10 flex flex-col justify-center items-center gap-5">
        <header>
          <h1 className="font-[600] text-2xl tracking-wider">
            LogIn to PerProject
          </h1>
        </header>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="group hover:cursor-pointer flex flex-col gap-1">
            <label
              htmlFor="emailInput"
              className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
            >
              Email:
            </label>
            <input
              type="email"
              id="emailInput"
              name="email"
              required
              className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
            />
          </div>
          <div className="group hover:cursor-pointer flex flex-col gap-1">
            <label
              htmlFor="passwordInput"
              className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
            >
              Password:
            </label>
            <input
              type="password"
              id="passwordInput"
              name="password"
              minLength={8}
              required
              className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
            />
          </div>
          <p className="text-xs font-[600] text-red-700">{errorMessage}</p>
          <Button type="submit">LogIn</Button>
          <Link
            to="/signup"
            className="text-xs font-[700] text-slate-400 hover:text-slate-100"
          >
            Don't have account yet? Sign Up!
          </Link>
        </form>
      </div>
    </section>
  );
};

export default Login;
