import React from "react";
import Button from "../../components/UI/Button";

// TODO:
// 1. Add options to project manager
// 2. AuthorId
// 3. CompanyId
//4. Add submition to projectContext

const AddNewProjectForm: React.FC = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
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
            type="text"
            required
            className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
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
          <option value="active">Me</option>
        </select>
      </div>
      <Button>Save</Button>
    </form>
  );
};

export default AddNewProjectForm;
