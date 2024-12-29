import React, { useState } from "react";
import Button from "../../components/UI/Button";
import { useCompanyCtx, AIDataType } from "../../store/CompanyContext";

const availableModels: string[] = [
  "gpt-4o-mini",
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-2024-08-06",
];

const ChangeAIConfig: React.FC = () => {
  const { changeCompanyAISettings, company } = useCompanyCtx();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorMessage("");
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: AIDataType = {
      available: company!.settings.AI.available,
      model: formData.get("model") as string,
      apiKey: formData.get("apiKey") as string,
    };

    const result = await changeCompanyAISettings(data);
    if (result.status && result.status == "Error") {
      setErrorMessage(result.text);
    }
  };

  return (
    <>
      <div className="max-w-screen-sm w-screen-sm flex flex-col justify-center items-center gap-5 p-5">
        <header>
          <h2 className="font-[400] text-xl">
            Change AI features configuration
          </h2>
        </header>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5"
        >
          <div className="flex justify-between items-center gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="model"
                className="font-[600] text-xs text-slate-400"
              >
                Model:
              </label>
              <select
                defaultValue={company?.settings.AI.model}
                id="model"
                name="model"
                className="bg-transparent border border-slate-500 rounded-sm p-2"
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="apiKey"
                className="font-[600] text-xs text-slate-400"
              >
                ApiKey:
              </label>
              <input
                id="apiKey"
                name="apiKey"
                defaultValue={company?.settings.AI.apiKey}
                type="password"
                className="bg-transparent border border-slate-500 rounded-sm p-2"
              />
            </div>
          </div>
          {errorMessage !== "" && (
            <p className="text-xs font-[600] text-red-700">{errorMessage}</p>
          )}
          <Button type="submit">Save</Button>
        </form>
      </div>
    </>
  );
};

export default ChangeAIConfig;
