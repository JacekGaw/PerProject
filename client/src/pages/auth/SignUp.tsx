import React, { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import Button from "../../components/UI/Button";
import { Link, useNavigate } from "react-router-dom";

interface SignUpCredentials {
  email: string;
  password: string;
  repeatPassword: string;
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  name: string;
  surname: string;
}

const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    setErrorMessage("");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("password-repeat") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    if (!formData || email || password || repeatPassword || name || surname) {
      setErrorMessage("Did not provided all required informations.");
      return;
    }
    const data: SignUpCredentials = {
      email,
      password,
      repeatPassword,
      role: "Developer",
      name,
      surname,
    };
    if (data.password?.toString().trim() !== data.repeatPassword?.toString().trim()) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    if (signup) {
      const result = await signup(data);
      if (result.success) {
        navigate("/login");
      } else {
        setErrorMessage(result.message || "Adding new user failed. Please try again.");
      }
    }
  };

  return (
    <section className="relative bg-white-blue dark:bg-black-blue w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-10">
        <header>
          <h1 className="font-[800] text-5xl sm:text-6xl tracking-wider">
            <span className="text-darkest-blue dark:text-lightest-blue">Per</span>
            <span className="text-normal-orange">Project</span>
          </h1>
        </header>
        <form
          className="flex flex-col justify-center items-stretch gap-5 w-full max-w-screen-sm"
          onSubmit={handleSubmit}
        >
          <h2 className="uppercase font-[600] text-xl border-b w-full text-center text-darkest-blue dark:text-slate-600 border-slate-600 p-2">
            SIGNUP
          </h2>

          <input
            type="email"
            id="emailInput"
            name="email"
            placeholder="Email"
            required
            className="bg-lightest-blue dark:bg-darkest-blue border border-lightest-blue dark:border-black-blue hover:border-dark-blue dark:hover:border-slate-200 transition-all duration-200 rounded-md p-3 text-black dark:text-white text-sm "
          />
          <div className="flex flex-col sm:flex-row sm:justify-between gap-5 sm:items-center">
            <input
              type="text"
              id="nameInput"
              name="name"
              placeholder="Name"
              required
              className="bg-lightest-blue dark:bg-darkest-blue border border-lightest-blue dark:border-black-blue hover:border-dark-blue dark:hover:border-slate-200 transition-all duration-200 rounded-md p-3 text-black dark:text-white text-sm "
            />

            <input
              type="text"
              id="surnameInput"
              name="surname"
              placeholder="Surname"
              required
              className="bg-lightest-blue dark:bg-darkest-blue border border-lightest-blue dark:border-black-blue hover:border-dark-blue dark:hover:border-slate-200 transition-all duration-200 rounded-md p-3 text-black dark:text-white text-sm "
            />
          </div>

          <input
            type="password"
            id="passwordInput"
            name="password"
            placeholder="Password"
            minLength={8}
            required
            className="bg-lightest-blue dark:bg-darkest-blue border border-lightest-blue dark:border-black-blue hover:border-dark-blue dark:hover:border-slate-200 transition-all duration-200 rounded-md p-3 text-black dark:text-white text-sm "
          />

          <input
            type="password"
            id="passwordRepeatInput"
            name="password-repeat"
            placeholder="Repeat password"
            required
            className="bg-lightest-blue dark:bg-darkest-blue border border-lightest-blue dark:border-black-blue hover:border-dark-blue dark:hover:border-slate-200 transition-all duration-200 rounded-md p-3 text-black dark:text-white text-sm "
          />

          <p className="text-xs font-[600] text-red-700">{errorMessage}</p>
          <Button className="self-center" type="submit">
            SIGNUP
          </Button>
          <Link to="/login" className="group text-sm text-center font-[600] text-slate-600">
            Already have an account? <span className="text-normal-orange">Log In</span>!
          </Link>
        </form>
      </div>
      <p className="fixed bottom-0 left0 w-full text-center p-2 mb-2 font-[400] text-xs md:text-sm  text-slate-600 ">
        Read about <span className="font-[600] text-slate-500">Privacy Policy</span> and{" "}
        <span className="font-[600] text-slate-500">Terms Of Use</span>
      </p>
    </section>
  );
};

export default SignUp;
