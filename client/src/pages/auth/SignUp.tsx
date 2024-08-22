import React, { useState } from "react";
import Button from "../../components/UI/Button";
import axios from "axios";



const SignUp: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    setErrorMessage("");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      repeatPassword: formData.get("password-repeat"),
      name: formData.get("name"),
      surname: formData.get("surname"),
    };
    if(data.password?.toString().trim() !== data.repeatPassword?.toString().trim()) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    await axios({
      method: "POST",
      url: "http://localhost:3002/auth/signup",
      data
    }).then((response) => {
      console.log(response.data);
    }).catch((err) => {
      setErrorMessage(err.response.data.message);
      console.log(err.response.data.message);
    })
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <div className="bg-blue-950 rounded-xl shadow-xl p-10 flex flex-col justify-center items-center gap-5">
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
        </form>
      </div>
    </section>
  );
};

export default SignUp;
