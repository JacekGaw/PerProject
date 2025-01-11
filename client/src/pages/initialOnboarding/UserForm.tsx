import React, { useState, useRef } from "react";
import Button from "../../components/UI/Button";
import axios from "axios";

const userRoles = ["Developer", "Tester", "Product Owner", "Project Manager", "Other"];

interface UserFormStepProps {
  nextAction: () => void;
  previousAction: () => void;
  companyId: number;
}

interface UserDataInterface {
  email: string;
  password: string;
  role: string;
  admin: boolean;
}

interface responseMessageInterface {
  type: "error" | "success";
  message: string;
}

const UserForm: React.FC<UserFormStepProps> = ({
  nextAction,
  previousAction,
  companyId,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [inputsDisabled, setInputsDisabled] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] =
    useState<responseMessageInterface>({ type: "success", message: "" });
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const repeatedPasswordInputRef = useRef<HTMLInputElement>(null);
  const roleSelectRef = useRef<HTMLSelectElement>(null);



  console.log(companyId);

  const handleTyping: () => void = () => {
    if (emailInputRef.current && passwordInputRef.current && repeatedPasswordInputRef.current) {
      if (
        emailInputRef.current.value.trim() !== "" &&
        passwordInputRef.current.value.trim() !== "" &&
        repeatedPasswordInputRef.current.value.trim() !== ""
      ) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }
  };

  const handleSubmit: () => Promise<void> = async () => {
    if (emailInputRef.current && roleSelectRef.current && passwordInputRef.current && repeatedPasswordInputRef.current) {
        if(passwordInputRef.current.value == repeatedPasswordInputRef.current.value){
            const userData: UserDataInterface = {
                email: emailInputRef.current.value,
                password: passwordInputRef.current.value,
                role: roleSelectRef.current.value,
                admin: true
              };
              try {
                setInputsDisabled(true);
                setButtonDisabled(true);
                const userResponse = await axios.post(
                  "/api/users",
                  userData
                );
                const createdUser = userResponse.data.user;
                console.log(createdUser);
                const assignmentResponse = await axios.post(
                    `/api/users/${createdUser.id}/assign-company`,
                  {companyId: companyId}
                )
                const createdAssignment = assignmentResponse.data;
                console.log(createdAssignment);
                setResponseMessage({
                  type: "success",
                  message: "Created user and added it to the company!",
                });
                setTimeout(() => nextAction(), 1000);
              } catch (err) {
                setInputsDisabled(false);
                setButtonDisabled(false);
                setResponseMessage({
                  type: "error",
                  message: "Something went wrong! Try again...",
                });
              }
        }
    }
  };

  return (
    <>
      <header>
        <h2 className="font-[400] text-xl">Add Your First User!</h2>
      </header>
      <p className="font-[200] text-justify text-base leading-7">
        Now it is time to create first user, that will be assigned to yours
        newly created company. Please fill the form with all of the needed
        informations. As previous, those informations will be configurable in
        the "User Settings". But please note, that this newly created user will
        gain Admin privileges by default!
      </p>
      <form className="flex flex-col gap-5  items-stretch">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleTyping}
            ref={emailInputRef}
            id="email"
            name="email"
            type="email"
            disabled={inputsDisabled}
            required
            className="bg-transparent border border-slate-500 rounded-sm p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="role">Role</label>
          <select
            onChange={handleTyping}
            ref={roleSelectRef}
            id="role"
            name="role"
            disabled={inputsDisabled}
            required
            className="bg-transparent border border-slate-500 rounded-sm p-2"
          >
           {userRoles.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleTyping}
            ref={passwordInputRef}
            id="password"
            name="password"
            type="password"
            disabled={inputsDisabled}
            required
            className="bg-transparent border border-slate-500 rounded-sm p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="repeated-password">Repeated Password</label>
          <input
            onChange={handleTyping}
            ref={repeatedPasswordInputRef}
            id="repeated-password"
            name="repeated-password"
            type="password"
            disabled={inputsDisabled}
            required
            className="bg-transparent border border-slate-500 rounded-sm p-2"
          />
        </div>
        {responseMessage.message !== "" && (
          <p
            className={`${
              responseMessage.type == "error"
                ? "text-red-700"
                : "text-green-600"
            } text-xs font-[700] text-center`}
          >
            {responseMessage.message}
          </p>
        )}
      </form>
      <div className="w-full flex gap-5 justify-between items-center">
        <Button onClick={previousAction}>Previous</Button>
        <Button onClick={handleSubmit} disabled={buttonDisabled}>
          Next
        </Button>
      </div>
    </>
  );
};

export default UserForm;
