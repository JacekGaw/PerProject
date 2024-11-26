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
    <section className="relative bg-white-blue dark:bg-black-blue w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-10">
        <header>
          <h1 className="font-[800] text-5xl sm:text-6xl tracking-wider">
            <span className="text-darkest-blue dark:text-lightest-blue">
              Per
            </span>
            <span className="text-normal-orange">Project</span>
          </h1>
        </header>
        <form
          className="flex flex-col justify-center items-stretch gap-5 w-full max-w-screen-sm"
          onSubmit={handleSubmit}
        >
          <h2 className="uppercase font-[600] text-xl border-b w-full text-center text-darkest-blue dark:text-slate-600 border-slate-600 p-2">
            LOGIN
          </h2>

          <input
            type="email"
            id="emailInput"
            name="email"
            placeholder="Email"
            required
            className="bg-lightest-blue dark:bg-darkest-blue border border-lightest-blue dark:border-black-blue hover:border-dark-blue dark:hover:border-slate-200 transition-all duration-200 rounded-md p-3 text-black dark:text-white text-sm "
          />

          <input
            type="password"
            id="passwordInput"
            name="password"
            placeholder="Password"
            minLength={8}
            required
            className="bg-lightest-blue dark:bg-darkest-blue border border-lightest-blue dark:border-black-blue hover:border-dark-blue dark:hover:border-slate-200 transition-all duration-200 rounded-md p-3 text-black dark:text-white text-sm "
          />

          <p className="text-xs font-[600] text-red-700">{errorMessage}</p>
          <Button className="self-center" type="submit">
            LOGIN
          </Button>
          <Link
            to="/signup"
            className="group text-sm text-center font-[600] text-slate-600"
          >
            Don't have account yet?{" "}
            <span className="text-normal-orange">Sign Up!</span>
          </Link>
        </form>
      </div>
      <p className="fixed bottom-0 left0 w-full text-center p-2 mb-2 font-[400] text-xs md:text-sm  text-slate-600 ">
        Read about{" "}
        <span className="font-[600] text-slate-500">Privacy Policy</span> and{" "}
        <span className="font-[600] text-slate-500">Terms Of Use</span>
      </p>
    </section>
  );
};

export default Login;
