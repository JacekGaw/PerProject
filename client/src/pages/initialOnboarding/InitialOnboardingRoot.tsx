import React, { useState } from "react";
import TermsStep from "./TermsStep";
import InfoForm from "./InfoForm";
import Summary from "./Summary";
import { motion, AnimatePresence } from "framer-motion";
import UserForm from "./UserForm";

const InitialOnboardingRoot: React.FC = () => {
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [newCompanyId, setNewCompanyId] = useState<number>(0);

  const goToNextStep = () => setOnboardingStep((prevState) => prevState + 1);
  const goToPreviousStep = () =>
    setOnboardingStep((prevState) => prevState - 1);

  const steps = [
    <TermsStep key={"terms"} nextAction={goToNextStep} />,
    <InfoForm
      key={"infoForm"}
      previousAction={goToPreviousStep}
      nextAction={goToNextStep}
      setCompanyKey={setNewCompanyId}
    />,
    <UserForm
      key={"userForm"}
      previousAction={goToPreviousStep}
      nextAction={goToNextStep}
      companyId={newCompanyId}
    />,
    <Summary key={"summary"} />
  ];
  return (
    <section className="w-full p-5 flex flex-col justify-center items-center min-h-screen">
      <div className="max-w-screen-md flex flex-col gap-5 p-5 items-center">
        <header className="w-full border-b py-2 border-dark-blue flex justify-between items-center">
          <h1 className="text-normal-orange font-[800] text-xl ">
            PerProject
          </h1>
          <p>{onboardingStep +1} / {steps.length}</p>
        </header>
        <AnimatePresence mode="wait">
          {steps.map(
            (step, index) =>
              index === onboardingStep && (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5 items-center"
                >
                  {step}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InitialOnboardingRoot;
