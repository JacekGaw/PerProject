import React, { useRef, useState } from "react";
import { useUserCtx, UserObj } from "../../store/UserContext";
import Button from "../../components/UI/Button";


interface UserDataInterface {
  name: string;
  surname: string;
}

interface responseMessageInterface {
  status: string;
  text: string;
}

const ChangeAccoundDetails: React.FC<{ user: UserObj }> = ({ user }) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] =
    useState<responseMessageInterface>({ status: "Status", text: "" });
  const nameInputRef = useRef<HTMLInputElement>(null);
  const surnameInputRef = useRef<HTMLInputElement>(null);
  const { changeUser} = useUserCtx()
  


  const handleSubmit: (event: React.SyntheticEvent) => Promise<void> = async (
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();
    if (nameInputRef.current && surnameInputRef.current) {
      const userData: UserDataInterface = {
        name: nameInputRef.current.value,
        surname: surnameInputRef.current.value,
      };
      try {
        setButtonDisabled(true);
        const response = await changeUser(userData, user.id);
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
          <h2 className="font-[400] text-xl">Change account details</h2>
        </header>
        <form
          className="flex flex-col gap-5 justify-center  items-stretch"
          onSubmit={handleSubmit}
        >

            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                ref={nameInputRef}
                name="name"
                type="name"
                required
                className="bg-transparent border border-slate-500 rounded-sm p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="surname">Surname</label>
              <input
                id="surname"
                ref={surnameInputRef}
                name="surname"
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
            Save
          </Button>
        </form>
      </section>
    </>
  );
}

export default ChangeAccoundDetails;
