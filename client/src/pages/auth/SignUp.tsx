import React, { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import Button from "../../components/UI/Button";
import { Link, useNavigate } from "react-router-dom";

interface SignUpCredentials {
  email: string,
  password: string,
  repeatPassword: string,
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other",
  name: string,
  surname: string
}


const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    setErrorMessage("");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const repeatPassword = formData.get("password-repeat") as string | null;
    const name = formData.get("name") as string | null;
    const surname = formData.get("surname") as string | null;
    if(!formData || !email || !password || !repeatPassword || !name || !surname) {
      setErrorMessage("Did not provided all required informations.");
      return;
    }
    const data: SignUpCredentials = {
      email,
      password,
      repeatPassword,
      role: "Developer",
      name,
      surname
    };
    if (
      data.password?.toString().trim() !==
      data.repeatPassword?.toString().trim()
    ) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    if (signup) {
      const result = await signup(data);
      if (result.success) {
        navigate("/login");
        console.log("New user added successfully");
      } else {
        setErrorMessage(
          result.message || "Adding new user failed. Please try again."
        );
      }
    }
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <div className="bg-darkest-blue rounded-xl shadow-xl p-10 flex flex-col justify-center items-center gap-5">
        <header>
          <h1 className="font-[300] text-2xl tracking-wider">
            SignUp to PerProject
          </h1>
        </header>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="group hover:cursor-pointer flex flex-col gap-1">
            <label
              htmlFor="nameInput"
              className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
            >
              Name:
            </label>
            <input
              type="text"
              id="nameInput"
              name="name"
              required
              className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
            />
          </div>
          <div className="group hover:cursor-pointer flex flex-col gap-1">
            <label
              htmlFor="surnameInput"
              className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
            >
              Surname:
            </label>
            <input
              type="text"
              id="surnameInput"
              name="surname"
              required
              className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
            />
          </div>
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
          <div className="group hover:cursor-pointer flex flex-col gap-1">
            <label
              htmlFor="passwordRepeatInput"
              className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
            >
              Repeat Password:
            </label>
            <input
              type="password"
              id="passwordRepeatInput"
              name="password-repeat"
              required
              className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
            />
          </div>
          <p className="text-xs font-[600] text-red-700">{errorMessage}</p>
          <Button type="submit">Sign Up</Button>
          <Link
            to="/login"
            className="text-xs font-[700] text-slate-400 hover:text-slate-100"
          >
            Already have an account? Log In!
          </Link>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
