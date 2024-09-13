import { useRouteError, Link } from "react-router-dom";
import Button from "../components/UI/Button";

interface RouteError {
  statusText?: string;
  message?: string
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page" className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-3xl">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <Button><Link to="/">Back to homepage</Link></Button>
      </div>
    </div>
  );
}
