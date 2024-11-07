import React from "react";
import { useCompanyCtx } from "../../store/CompanyContext";
import Button from "../../components/UI/Button";

const CompanySettings: React.FC = () => {

    const handleSubmit: (event: React.SyntheticEvent) => Promise<void> = async (
        event: React.SyntheticEvent
      ) => {
        event.preventDefault();
        
        
      };


  return (
    <>
      <div className="shadow-xl rounded-xl flex flex-col">
        <header className="rounded-t-xl flex justify-between items-center  bg-darkest-blue p-4">
          <h3 className="font-xl uppercase font-[500]">Settings:</h3>
        </header>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Model</label>
                <input name="model" type="text" />
            </div>
            <div>
                <label>ApiKey</label>
                <input name="apiKey" type="text" />
            </div>
            <Button type="submit">Save</Button>
        </form>
      </div>
    </>
  );
};

export default CompanySettings;
