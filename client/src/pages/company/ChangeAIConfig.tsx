import React from 'react'
import Button from "../../components/UI/Button";
import { useCompanyCtx, AIDataType } from "../../store/CompanyContext";

const availableModels: string[] = [
    "gpt-4o-mini",
    "gpt-4o-mini-2024-07-18",
    "gpt-4o-2024-08-06"
]

const ChangeAIConfig: React.FC = () => {
    const { changeCompanyAISettings, company } = useCompanyCtx();

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
    
        // Get form data
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
    
        // Extract model and apiKey from form data
        const data: AIDataType = {
          available: company!.settings.AI.available, // Use the state for the available toggle
          model: formData.get("model") as string,
          apiKey: formData.get("apiKey") as string,
        };
    
        // Call the context function to update settings
        const result = await changeCompanyAISettings(data);
    
        // Handle the result if needed (e.g., show a success or error message)
        console.log(result);
      };

    return (
        <>
        <div className="max-w-screen-sm w-screen-sm flex flex-col justify-center items-center gap-5 p-5">
      <header>
        <h2 className="font-[400] text-xl">Change AI features configuration</h2>
      </header>
    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
        <div className="flex justify-between items-center gap-5">
        <div className="flex flex-col gap-1">
            <label htmlFor="model" className="font-[600] text-xs text-slate-400">Model:</label>
          <select defaultValue={company?.settings.AI.model} id="model" name="model" className="bg-transparent border border-slate-500 rounded-sm p-2">
            {availableModels.map((model) => (
                <option key={model} value={model} >{model}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="apiKey" className="font-[600] text-xs text-slate-400">ApiKey:</label>
          <input id="apiKey" name="apiKey" defaultValue={company?.settings.AI.apiKey} type="text" className="bg-transparent border border-slate-500 rounded-sm p-2" />
        </div>
        </div>
        <Button type="submit">Save</Button>
      </form>
      </div>
        </>
    )
}

export default ChangeAIConfig;