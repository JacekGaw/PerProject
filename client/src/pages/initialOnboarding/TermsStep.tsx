import React, { useState } from "react";
import Button from "../../components/UI/Button";

interface TermsStepProps {
  nextAction: () => void;
}

const TermsStep: React.FC<TermsStepProps> = ({ nextAction }) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  return (
    <>
      <header>
        <h2 className="font-[400] text-xl">Let's get started!</h2>
      </header>
      <p  className="font-[200] text-justify text-base leading-7"
      >
        Hello from PerProject Team! It seems that you have just started and we
        are very happy that you choose our solutions! We believe, that we can be
        your only and best project management tool, that you would use with
        pleasure.
        <br />
        <br />
        If you see this, do not worry. We will guide you thrue the whole
        configuration! There are a couple of steps that we need you to do, to
        fully prepare this tool for your individual needs. But obviusly before
        we dive in, we need you to read our Terms And Conditions of using our
        product. If you alreary did this, accept them and we can move on!
      </p>
      <div className="flex gap-5 justify-center items-center">
        <label htmlFor="accept">
          I have read and accepted Terms And Conditions of the PerProject
        </label>
        <input
          id="accept"
          type="checkbox"
          onChange={() => setButtonDisabled((prevState) => !prevState)}
        />
      </div>
      <div className="w-full flex gap-5 justify-end items-center">
        <Button onClick={nextAction} disabled={buttonDisabled}>
          Next
        </Button>
      </div>
    </>
  );
};

export default TermsStep;
