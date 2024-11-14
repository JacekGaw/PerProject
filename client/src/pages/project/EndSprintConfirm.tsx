import React, { useState, useRef } from "react";
import Button from "../../components/UI/Button";
import MarkdownViewer from "../../components/UI/MarkdownViewer"; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  useSprintsCtx,
  SprintType,
} from "../../store/SprintsContext";
import { Task } from "../../store/TasksContext";
import ButtonOutlined from "../../components/UI/ButtonOutlined";
import { useCompanyCtx } from "../../store/CompanyContext";


interface EditSprintFormProps {
  sprintData: SprintType;
  exit: () => void | undefined;
  tasksArr: Task[];
}

const EndSprintConfirm: React.FC<EditSprintFormProps> = ({
  sprintData,
  exit,
  tasksArr,
}) => {
  const { endSprint } = useSprintsCtx();
  const formRef = useRef<HTMLFormElement>(null);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [sprintReport, setSprintReport] = useState<string | null>(null);
  const { company } = useCompanyCtx();

  const handleEndSprint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);

    const formData = new FormData(e.currentTarget);
    const tasksAction = formData.get("tasksAction") as "backlog" | "done";
    const retro = formData.get("retro") === "true";
    console.log("RETRO?", retro);
    
    try {
      const response = await endSprint(sprintData.id, tasksAction, retro);
      setSprintReport(response.text);
      setButtonDisabled(false);
      console.log(response);
    } catch (err) {
      setButtonDisabled(false);
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-screen-md flex flex-col gap-5 p-5">
      <header className="py-2 border-b flex flex-col gap-2 border-b-slate-400">
        <h1 className="text-xl font-[600]">End Sprint {sprintData.name}</h1>
        <p className="text-xs font-[400] text-slate-400">
          Sprint will have new status Completed and will be still available in
          the archive tab. You can decide what do you want to do with tasks
          and generate sprint retro!
        </p>
      </header>
      
      <form className="flex flex-col gap-10 justify-center" ref={formRef} onSubmit={handleEndSprint}>
        {tasksArr.filter((task) => task.status !== "Done").length > 0 ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="tasksAction">
              You have {tasksArr.filter((task) => task.status !== "Done").length} tasks
              that are not completed.
            </label>
            <select name="tasksAction" id="tasksAction" className="bg-darkest-blue p-2">
              <option value="backlog">Move to backlog</option>
              <option value="done">Mark as done</option>
            </select>
          </div>
        ) : (
          <p className="font-[400] text-base">Congrats! You completed all tasks within that sprint!</p>
        )}
        <div className="flex justify-end items-center gap-2">
          <Button disabled={buttonDisabled} type="submit" name="retro" value="false">Complete</Button>
          {company?.settings.AI.available && <ButtonOutlined type="submit" name="retro" value="true" disabled={buttonDisabled}>Complete and generate retro</ButtonOutlined>}
        </div>
      </form>
      
      {sprintReport && (
        <MarkdownViewer content={sprintReport} />
      )}
    </div>
  );
};

export default EndSprintConfirm;
