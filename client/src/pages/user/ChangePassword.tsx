import React, { useRef, useState } from "react";
import { useUserCtx, UserObj } from "../../store/UserContext";
import Button from "../../components/UI/Button";

interface UserDataInterface {
  oldPassword: string;
  newPassword: string;
}

interface responseMessageInterface {
  status: string;
  text: string;
}

const ChangePassword: React.FC<{ user: UserObj }> = ({ user }) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] =
    useState<responseMessageInterface>({ status: "Status", text: "" });
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const repeatedNewPasswordRef = useRef<HTMLInputElement>(null);
  const { changeUserPassword } = useUserCtx();

  const handleSubmit: (event: React.SyntheticEvent) => Promise<void> = async (
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();
    if (
      oldPasswordRef.current &&
      newPasswordRef.current &&
      repeatedNewPasswordRef.current
    ) {
      if (
        newPasswordRef.current.value.trim() !==
        repeatedNewPasswordRef.current.value.trim()
      ) {
        setResponseMessage({
          status: "Error",
          text: "New passwords are not the same!",
        });
      }
      const userData: UserDataInterface = {
        oldPassword: oldPasswordRef.current.value,
        newPassword: newPasswordRef.current.value,
      };
      try {
        setButtonDisabled(true);
        const response = await changeUserPassword(userData, user.id);
        setResponseMessage(response);
        setButtonDisabled(false);
      } catch (err) {
        setButtonDisabled(false);
        setResponseMessage({
          status: "Error",
          text: "An error occurred while updating the user.",
        });
      }
    }
  };

  return (
    <>
      <section className="max-w-screen-sm w-screen-sm flex flex-col gap-5 justify-center items-center">
        <header>
          <h2 className="font-[400] text-xl">
            Change password for: {user.name} {user.surname}
          </h2>
        </header>
        <form
          className="flex flex-col gap-5 justify-center  items-stretch"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              id="oldPassword"
              ref={oldPasswordRef}
              name="oldPassword"
              type="password"
              required
              className="bg-transparent border border-slate-500 rounded-sm p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              ref={newPasswordRef}
              name="newPassword"
              type="surname"
              required
              className="bg-transparent border border-slate-500 rounded-sm p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="repeatedNewPassword">Repeat New Password</label>
            <input
              id="repeatedNewPassword"
              ref={repeatedNewPasswordRef}
              name="repeatedNewPassword"
              type="surname"
              required
              className="bg-transparent border border-slate-500 rounded-sm p-2"
            />
          </div>

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
          <Button type="submit" disabled={buttonDisabled ? true : false}>
            Change
          </Button>
        </form>
      </section>
    </>
  );
};

export default ChangePassword;
