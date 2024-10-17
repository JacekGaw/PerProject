import React, { useState, useRef } from "react";
import Button from "../../components/UI/Button";
import axios from "axios";
import { useCompanyCtx } from "../../store/CompanyContext";

const userRoles = [
  "Developer",
  "Tester",
  "Product Owner",
  "Project Manager",
  "Other",
];

interface UserDataInterface {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: string;
  admin: boolean;
}

interface responseMessageInterface {
  type: "error" | "success";
  message: string;
}

const AddNewUser: React.FC = () => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] =
    useState<responseMessageInterface>({ type: "success", message: "" });
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const surnameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const repeatedPasswordInputRef = useRef<HTMLInputElement>(null);
  const roleSelectRef = useRef<HTMLSelectElement>(null);
  const { company } = useCompanyCtx();

  const handleTyping: () => void = () => {
    if (
      emailInputRef.current &&
      passwordInputRef.current &&
      repeatedPasswordInputRef.current
    ) {
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

  const handleSubmit: (event: React.SyntheticEvent) => Promise<void> = async (
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();
    if (
      emailInputRef.current &&
      roleSelectRef.current &&
      passwordInputRef.current &&
      repeatedPasswordInputRef.current &&
      nameInputRef.current &&
      surnameInputRef.current
    ) {
      if (
        passwordInputRef.current.value == repeatedPasswordInputRef.current.value
      ) {
        const userData: UserDataInterface = {
          email: emailInputRef.current.value,
          password: passwordInputRef.current.value,
          role: roleSelectRef.current.value,
          name: nameInputRef.current.value,
          surname: surnameInputRef.current.value,
          admin: false,
        };
        try {
          setButtonDisabled(true);
          const userResponse = await axios.post(
            "http://localhost:3002/api/users",
            userData
          );
          const createdUser = userResponse.data.user;
          console.log(createdUser);
          await axios.post(
            `http://localhost:3002/api/users/${createdUser.id}/assign-company`,
            { companyId: company?.id }
          );
          setResponseMessage({
            type: "success",
            message: "Created user and added it to the company!",
          });
          setButtonDisabled(false);
        } catch (err) {
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
    <section className="max-w-screen-sm w-screen-sm">
      <header>
        <h2 className="font-[400] text-xl">Add new user</h2>
      </header>
      <form
        className="flex flex-col gap-5 justify-center  items-stretch"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-5 items-center justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleTyping}
              ref={emailInputRef}
              id="email"
              name="email"
              type="email"
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
              required
              className="bg-transparent border border-slate-500 rounded-sm p-2"
            >
              {userRoles.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-5 justify-between items-center">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input
              onChange={handleTyping}
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
              onChange={handleTyping}
              id="surname"
              ref={surnameInputRef}
              name="surname"
              type="surname"
              required
              className="bg-transparent border border-slate-500 rounded-sm p-2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleTyping}
            ref={passwordInputRef}
            id="password"
            name="password"
            type="password"
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
        <Button type="submit" disabled={buttonDisabled ? true : false}>
          Save
        </Button>
      </form>
    </section>
  );
};

export default AddNewUser;
