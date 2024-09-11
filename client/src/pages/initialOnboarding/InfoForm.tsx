import React, { useState, useRef } from "react";
import Button from "../../components/UI/Button";
import api from "../../api/api";
import axios from "axios";

interface InfoFormStepProps {
  nextAction: () => void;
  previousAction: () => void;
  setCompanyKey: (arg0: number) => void;
}

interface CompanyDataInterface {
  name: string;
  description: string;
}

interface responseMessageInterface {
  type: "error" | "success";
  message: string;
}

const InfoForm: React.FC<InfoFormStepProps> = ({
  nextAction,
  previousAction,
  setCompanyKey,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [inputsDisabled, setInputsDisabled] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] =
    useState<responseMessageInterface>({ type: "success", message: "" });
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const handleTyping: () => void = () => {
    if (nameInputRef.current && descriptionInputRef.current) {
      if (
        nameInputRef.current.value.trim() !== "" &&
        descriptionInputRef.current.value.trim() !== ""
      ) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }
  };

  const handleSubmit: () => Promise<void> = async () => {
    if (nameInputRef.current && descriptionInputRef.current) {
      const companyData: CompanyDataInterface = {
        name: nameInputRef.current.value,
        description: descriptionInputRef.current.value,
      };
      try {
        setInputsDisabled(true);
        setButtonDisabled(true);
        const response = await axios.post(
          "http://localhost:3002/api/company",
          companyData
        );
        setCompanyKey(response.data.company[0].id);
        setResponseMessage({
          type: "success",
          message: response.data.message,
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
  };

  return (
    <>
      <header>
        <h2 className="font-[400] text-xl">
          Set up Your Company Informations!
        </h2>
      </header>
      <p className="font-[200] text-justify text-base leading-7">
        Firstly you need to set up your company informations. This is the first
        configuration step, that will enable all of the other ones! Just
        remember, that all of those informations that you will set now, later
        you can change in Company Settings!
      </p>
      <form className="flex flex-col gap-5  items-stretch">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-[200]">
            Name of Your Company *
          </label>
          <input
            onChange={handleTyping}
            ref={nameInputRef}
            id="name"
            name="name"
            type="text"
            disabled={inputsDisabled}
            required
            className="bg-transparent border border-slate-500 rounded-sm p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            onChange={handleTyping}
            ref={descriptionInputRef}
            id="description"
            name="description"
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

export default InfoForm;
