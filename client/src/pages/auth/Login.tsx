import React, {useState} from "react";
import Button from "../../components/UI/Button";
import axios from "axios";

const Login:React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event:React.SyntheticEvent<HTMLFormElement>) => {
    setErrorMessage("");
    event.preventDefault()
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    await axios({
      method: "POST",
      url: "http://localhost:3002/auth/login",
      data
    }).then((response) => {
      console.log(response.data);
    }).catch ((err) => {
      console.log(err.response.data.message);
      setErrorMessage(err.response.data.message);
    })
  }

  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <div className="bg-neutral-800 rounded-xl shadow-xl p-10 flex flex-col justify-center items-center gap-5">
        <header>
          <h1 className="font-[600] text-2xl tracking-wider">LogIn to PerProject</h1>
        </header>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="group hover:cursor-pointer flex flex-col gap-1">
            <label htmlFor="emailInput" className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200">Email:</label>
            <input type="email" id="emailInput" name="email" required className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm" />
          </div>
          <div className="group hover:cursor-pointer flex flex-col gap-1">
            <label htmlFor="passwordInput" className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200">Password:</label>
            <input type="password" id="passwordInput" name="password" minLength={8} required className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm" />
          </div>
          <p className="text-xs font-[600] text-red-700">{errorMessage}</p>
          <Button type="submit">LogIn</Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
