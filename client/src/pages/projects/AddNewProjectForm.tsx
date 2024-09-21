import React, {useState} from "react";
import Button from "../../components/UI/Button";
import { useCompanyCtx } from "../../store/CompanyContext";
import { CompanyUserType } from "../../store/CompanyContext";
import { useAuth } from "../../store/AuthContext";
import { useProjectCtx } from "../../store/ProjectsContext";
import { Navigate } from "react-router-dom";

interface Params {
  exit: () => void
}
// TODO:
//4. Add submition to projectContext

const AddNewProjectForm: React.FC<Params> = ({exit}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { companyUsers, company} = useCompanyCtx();
  const { addNewProject} = useProjectCtx();
  const { user, logOut } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    console.log("Submitted");
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const alias = formData.get("alias") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const projectManagerId = formData.get("projectManager") as string;
    if(!name || !alias || !description){
      return setErrorMessage("You didn't provided all required data");
    }
    if(!user){
      return logOut();
    }
    const data = {
      name,
      alias: alias.toUpperCase(),
      description,
      startDate: startDate || null, // If empty, set to null
      endDate: endDate || null,
      projectManagerId: parseInt(projectManagerId),
      authorId: user.id,
      companyId: company.id
    }
    try {
      const response = await addNewProject(data);
      if(response.status == "Success") {
        setErrorMessage("");
        return exit();
      }
      else {
        throw new Error(response.text)
      }
    } catch (err) {
      setErrorMessage(`Could not add new project. ${err}`);
      console.log(err);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 justify-center max-w-[400px]">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <div className="group hover:cursor-pointer w-full flex flex-col gap-1">
          <label
            htmlFor="name"
            className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
          >
            Name
          </label>
          <input
            name="name"
            id="name"
            type="text"
            required
            className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
          />
        </div>
        <div className="group hover:cursor-pointer w-full flex flex-col gap-1">
          <label
            htmlFor="alias"
            className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
          >
            Alias
          </label>
          <input
            name="alias"
            id="alias"
            maxLength={4}
            type="text"
            required
            className="bg-inherit uppercase border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
          />
        </div>
      </div>

      <div className="group hover:cursor-pointer flex flex-col gap-1">
        <label
          htmlFor="description"
          className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
      <div className="group hover:cursor-pointer w-full flex flex-col gap-1">
        <label
          htmlFor="startDate"
          className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
        >
          Start Date
        </label>
        <input
          name="startDate"
          id="startDate"
          type="date"
          className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
        />
      </div>
      <div className="group w-full hover:cursor-pointer flex flex-col gap-1">
        <label
          htmlFor="endDate"
          className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
        >
          End Date
        </label>
        <input
          name="endDate"
          id="endDate"
          type="date"
          className="bg-inherit w-full border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
        />
      </div>
      </div>
      <div className="group hover:cursor-pointer flex flex-col gap-1">
        <label
          htmlFor="projectManager"
          className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
        >
          Project Manager
        </label>
        <select
          name="projectManager"
          id="projectManager"
          className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
        >
          {companyUsers.map((user: CompanyUserType) => {
            return (
              <option key={user.id} value={user.id}>{user.email}</option>
            )
          })}
        </select>
      </div>
      {errorMessage && <p className="font-[800] text-sm text-red-500">{errorMessage}</p>}
      <Button>Save</Button>
    </form>
  );
};

export default AddNewProjectForm;
