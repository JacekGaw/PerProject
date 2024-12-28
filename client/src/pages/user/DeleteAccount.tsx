import React, { useState } from "react";
import { useUserCtx, UserObj } from "../../store/UserContext";
import Button from "../../components/UI/Button";
import { CompanyUserType } from "../../store/CompanyContext";
import { useAuth } from "../../store/AuthContext";

interface responseMessageInterface {
  status: string;
  text: string;
}

const DeleteAccount: React.FC<{ userObject: UserObj | CompanyUserType }> = ({
  userObject,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] =
    useState<responseMessageInterface>({ status: "Status", text: "" });
  const { user } = useAuth();
  const { deleteUser } = useUserCtx();

  const handleSubmit = async () => {
    try {
      setButtonDisabled(true);
      const response = await deleteUser(userObject.id);
      setResponseMessage(response);
      setButtonDisabled(false);
    } catch (err) {
      setButtonDisabled(false);
      setResponseMessage({
        status: "Error",
        text: "An error occurred while deleting user.",
      });
    }
  };

  return (
    <>
      <section className="max-w-screen-sm w-screen-sm flex flex-col gap-5 justify-center items-center">
        <header>
          <h2 className="font-[400] text-xl">
            Delete account for: {userObject.name} {userObject.surname}
          </h2>
        </header>
        {user && (
          <p>
            Are you sure you want to delete this account? Note that this
            operation is IRREVERSIBLE! Click Delete to proceed or close this
            modal if you do not want to do it.
          </p>
        )}
        {responseMessage.text !== "" && (
          <p
            className={`${
              responseMessage.status == "Error"
                ? "text-red-700"
                : "text-green-600"
            } text-xs font-[700] text-center`}
          >
            {responseMessage.text}
          </p>
        )}
        {user && (
          <Button
            onClick={handleSubmit}
            disabled={buttonDisabled ? true : false}
          >
            Delete
          </Button>
        )}
      </section>
    </>
  );
};

export default DeleteAccount;
