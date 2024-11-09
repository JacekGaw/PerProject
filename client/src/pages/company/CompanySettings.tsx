import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCompanyCtx } from "../../store/CompanyContext";
import Modal, { ModalRef } from "../../components/UI/Modal";
import ChangeAIConfig from "./ChangeAIConfig";

const CompanySettings: React.FC = () => {
  const { changeCompanyAIAvailability, company } = useCompanyCtx();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [availableChecked, setAvailableChecked] = useState<boolean>(
    company!.settings.AI.available
  );

  console.log(company?.settings);
  const modalRef = useRef<ModalRef | null>(null);

  const handleChangeAvailability = async (available: boolean) => {
    setErrorMessage("");
    setAvailableChecked((p) => !p);
    console.log(available);
    const result = await changeCompanyAIAvailability(available);
    if(result.status && result.status == "Error") {
      setAvailableChecked((p) => !p);
      setErrorMessage(result.text);
    }
  };

  return (
    <>
      <Modal ref={modalRef}>
        <ChangeAIConfig />
      </Modal>
      <div className="shadow-xl rounded-xl flex flex-col">
        <header className="rounded-t-xl flex justify-between items-center bg-darkest-blue p-4">
          <h3 className="font-xl uppercase font-[500]">Settings:</h3>
        </header>
        <div className="p-10">
          <div className="flex flex-col gap-4">
            <header className="w-full p-2 border-b border-b-slate-400">
              <h4 className="text-lg font-[600]">AI Features:</h4>
            </header>
            <div className="flex gap-4 items-center justify-between p-2">
              <div className="flex gap-2 items-center">
                <p>Available:</p>
                <div
                  onClick={() => handleChangeAvailability(!availableChecked)}
                  className="relative w-16 h-8 rounded-full cursor-pointer px-2"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: availableChecked
                        ? "rgb(34, 197, 94)"
                        : "rgb(220, 38, 38)",
                    }}
                    layout
                    transition={{
                      type: "spring",
                      stiffness: 200, // Reduced stiffness for smoother animation
                      damping: 20, // Increased damping to reduce bouncing
                    }}
                  />
                  <motion.div
                    className="absolute top-1 left-1 h-6 w-6 bg-white rounded-full shadow-md"
                    initial={{ x: 0 }}
                    animate={{ x: availableChecked ? 32 : 0 }} // Adjusted to match container width
                    transition={{
                      type: "spring",
                      stiffness: 150, // Lowered stiffness for softer movement
                      damping: 25, // Higher damping to minimize bounce
                    }}
                  />
                </div>
                {errorMessage !== "" && <p className="text-xs font-[600] text-red-700">{errorMessage}</p>}
                
              </div>
              <motion.button
                initial={{ scale: 1 }}
                whileHover={{
                  scale: 1.03
                }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-blue-300 font-[300] rounded-lg border border-slate-400 "
                onClick={() => modalRef.current && modalRef.current.open()}
              >
                Change configuration
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanySettings;
