import React, { useState, useRef } from "react";
import Button from "../../components/UI/Button";
import { useSprintsCtx, NewSprintType, SprintType } from "../../store/SprintsContext";

interface EditSprintFormProps {
  sprintData: SprintType;
  exit: () => void | undefined;
}

const EditSprintForm: React.FC<EditSprintFormProps> = ({ sprintData, exit }) => {
const { changeSprint } = useSprintsCtx();
const formRef = useRef<HTMLFormElement>(null);
const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)





  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true)

    const formData = new FormData(e.currentTarget);
    const sprintName = formData.get("name") as string;
    const sprintTarget = formData.get("target") as string;
    const sprintDateFrom = formData.get("dateFrom") as Date | null;
    const sprintDateTo = formData.get("dateTo") as Date | null;

    // if(sprintDateFrom == "") {
    //     sprintDateFrom = null
    // }
    // if(sprintDateTo == "") {
    //     sprintDateTo = null
    // }
    const data = {
        name: sprintName,
        target: sprintTarget,
        dateFrom: sprintDateFrom,
        dateTo: sprintDateTo,
    } as NewSprintType
    try {
        await changeSprint(sprintData.id, data);
        formRef.current?.reset();
        setButtonDisabled(false);
        exit();
    } catch (err) {
        setButtonDisabled(false);
        console.log(err);
    }
  };



  return (
    <>
      <div className="w-full max-w-screen-md flex flex-col gap-5 p-5">
        <header className="py-2 border-b flex flex-col gap-2 border-b-slate-400">
          <h1 className="text-xl font-[600]">Create new sprint</h1>
          <p className="text-xs font-[400] text-slate-400"></p>
        </header>
        <form ref={formRef} onSubmit={handleCreate} className="flex flex-col  gap-5">
          <div>
            <div className="flex flex-col gap-2 justify-between items-center">
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
                  defaultValue={sprintData.name}
                  required
                  className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                />
              </div>
              <div className="group hover:cursor-pointer w-full flex flex-col gap-1">
                <label
                  htmlFor="target"
                  className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
                >
                  Target
                </label>
                <textarea
                  name="target"
                  defaultValue={sprintData.target ?? ""}
                  id="target"
                  className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                />
              </div>
              <div className="flex gap-2 justify-center items-center w-full">
                <div className="group hover:cursor-pointer w-full flex flex-col gap-1">
                  <label
                    htmlFor="dateFrom"
                    className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
                  >
                    From
                  </label>
                  <input
                    name="dateFrom"
                    id="dateFrom"
                    type="date"
                    defaultValue={sprintData.dateFrom ? new Date(sprintData.dateFrom).toISOString().split("T")[0] : ""}
                    className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                  />
                </div>
                <div className="group hover:cursor-pointer w-full flex flex-col gap-1">
                  <label
                    htmlFor="dateTo"
                    className="font-[100] group-hover:translate-x-2 group-hover:font-[500] group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
                  >
                    To
                  </label>
                  <input
                    name="dateTo"
                    id="dateTo"
                    defaultValue={sprintData.dateFrom ? new Date(sprintData.dateFrom).toISOString().split("T")[0] : ""}
                    type="date"
                    className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-5 items-center">
            <Button disabled={buttonDisabled} type="submit">Save</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSprintForm;
