import { Link } from "react-router-dom";
const Login = () => {
  return (
    <section className="flex flex-col justify-center items-center p-5 rounded-xl bg-slate-800 text-slate-50 shadow-md">
      <h1 className="font-bold text-2xl p-2">LogIn</h1>
      <Link to="/auth/google">
        <button className="p-2 rounded-xl shadow-sm border-2 bg-slate-100 text-slate-800">
          LogIn using Google Account
        </button>
      </Link>
    </section>
  );
};

export default Login;
