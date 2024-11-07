import React, { useState } from "react";
import { useCompanyCtx } from "../../store/CompanyContext";
import Button from "../../components/UI/Button";

interface AIDataType {
  available: boolean; // Available is a boolean value
  model: string;
  apiKey: string;
}

const CompanySettings: React.FC = () => {
  const { changeCompanyAISettings } = useCompanyCtx();

  // State to manage the toggle for available
  const [available, setAvailable] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    // Get form data
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Extract model and apiKey from form data
    const data: AIDataType = {
      available: available, // Use the state for the available toggle
      model: formData.get("model") as string,
      apiKey: formData.get("apiKey") as string,
    };

    // Call the context function to update settings
    const result = await changeCompanyAISettings(data);

    // Handle the result if needed (e.g., show a success or error message)
    console.log(result);
  };

  return (
    <div className="shadow-xl rounded-xl flex flex-col">
      <header className="rounded-t-xl flex justify-between items-center bg-darkest-blue p-4">
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
        <div>
          <label>Available</label>
          <input
            type="checkbox"
            checked={available}
            onChange={() => setAvailable((prev) => !prev)}
          />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};

export default CompanySettings;
