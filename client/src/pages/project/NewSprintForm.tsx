import React, { useState, useRef } from "react";
import { Task } from "../../store/TasksContext";
import Button from "../../components/UI/Button";
import { useSprintsCtx, NewSprintType } from "../../store/SprintsContext";

interface NewSprintFormProps {
  tasks: Task[];
  exit: () => void | undefined;
}

const NewSprintForm: React.FC<NewSprintFormProps> = ({ tasks, exit }) => {
  const [checkedArr, setCheckedArr] = useState<number[]>([]);
const { addNewSprint } = useSprintsCtx();
const formRef = useRef<HTMLFormElement>(null);
const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)



  const handleToggleCheckbox = (index: number) => {
    setCheckedArr(
      (prevCheckedArr) =>
        prevCheckedArr.includes(index)
          ? prevCheckedArr.filter((i) => i !== index) // Uncheck if already checked
          : [...prevCheckedArr, index] // Add if not checked
    );
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true)
    const selectedTasks = tasks
      .filter((_, index) => checkedArr.includes(index))
      .map((item) => item.id) as Partial<Task>[];

    const formData = new FormData(e.currentTarget);
    const sprintName = formData.get("name") as string;
    const sprintTarget = formData.get("target") as string;
    let sprintDateFrom = formData.get("dateFrom") as string | null;
    let sprintDateTo = formData.get("dateTo") as string | null;

    if(sprintDateFrom == "") {
        sprintDateFrom = null
    }
    if(sprintDateTo == "") {
        sprintDateTo = null
    }
    const data = {
        name: sprintName,
        target: sprintTarget,
        dateFrom: sprintDateFrom,
        dateTo: sprintDateTo,
        tasks: selectedTasks
    } as NewSprintType
    try {
        await addNewSprint(data);
        setCheckedArr([]);
        formRef.current?.reset();
        setButtonDisabled(false);
        exit();
    } catch (err) {
        setButtonDisabled(false);
        console.log(err);
    }
  };

  const handleResetSelection = () => {
    setCheckedArr([]);
  };

  const handleSelectAll = () => {
    const arr = tasks.map((_, index) => index);
    setCheckedArr(arr);
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
                    type="date"
                    className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task, index) => {
              return (
                <div
                  key={task.taskText}
                  onClick={() => handleToggleCheckbox(index)}
                  className="p-2 bg-darkest-blue cursor-pointer flex gap-5 items-center"
                >
                  <input
                    id={task.taskText}
                    name="task"
                    type="checkbox"
                    checked={checkedArr.includes(index)}
                  />
                  <p>{task.taskText}</p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-5 items-center">
          <button
              type="button"
              onClick={handleSelectAll}
              className="underline text-sm text-slate-200"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleResetSelection}
              className="underline text-sm text-slate-200"
            >
              Reset Selection
            </button>
            <Button disabled={buttonDisabled} type="submit">Create</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewSprintForm;
