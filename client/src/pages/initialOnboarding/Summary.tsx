import React from "react";
import Button from "../../components/UI/Button";
import { Link } from "react-router-dom";

const Summary: React.FC = () => {
  return (
    <>
      <header>
        <h2 className="font-[400] text-xl">Congratulations!</h2>
      </header>
      <p className="font-[200] text-justify text-base leading-7">
        You have succesfully created and configured your company and created new
        user! Now it is time for the first log in to the system! Do not hesitate
        and click the button below...
      </p>
      <div className="w-full flex gap-5 justify-center items-center">
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    </>
  );
};

export default Summary;
