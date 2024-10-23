import React, { useState } from "react";
import { motion } from "framer-motion";
import saveIcon from "../../assets/img/check.svg"
import exitIcon from "../../assets/img/close.svg"
import editIcon from "../../assets/img/edit.svg"
import { useTasksCtx, Task, SubTask } from "../../store/TasksContext";
import { useProjectCtx, Project } from "../../store/ProjectsContext";


const ParentContainer = {
    init:{opacity: 1},
    show:{opacity:1}
}

const ChildrenComponent = {
    init:{opacity: 0},
    show:{opacity:1}
}

interface DescriptionComponentProps {
  type?: "subtask" | "task" | "project";
  task: Task | SubTask | Project;
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({
  type = "task",
  task,
}) => {
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const { changeTask} = useTasksCtx();
  const { changeProject} = useProjectCtx();

  const changeDescription = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDescription = formData.get("description") as string | null;
    try {
      if(type !== "project"){
        await changeTask(type, task.id!, {description: newDescription});
      }
      else {
        await changeProject(task.id!, {description: newDescription});
      }
      setEditDescription(false);
      location.reload();
    } catch (err){
      console.log(err);
      setEditDescription(false);
    }
  }


  return (
    <>
      {editDescription ? (
        <form className="flex gap-2 justify-between" onSubmit={changeDescription}>
          <textarea name="description" id="description" defaultValue={task.description ? task.description : "No task description"} className="w-full bg-darkest-blue border border-slate-500 rounded-md p-2"></textarea>
          <div className="">
            <button type="submit" className="border border-slate-600 p-2 rounded-md flex justify-center items-center"><img src={saveIcon} className="w-4 max-h-6" /></button>
            <button onClick={() => setEditDescription(false)} className="border border-slate-600 p-2 rounded-md flex justify-center items-center"><img src={exitIcon} className="w-4 max-h-6" /></button>
          </div>
        </form>
      ) : (
        <motion.div variants={ParentContainer} onClick={() => setEditDescription(true)} initial="init" whileHover="show"  className="cursor-pointer font-[200] text-sm p-2 border-b flex gap-2 justify-between" >
            <p className={`whitespace-pre-line ${type == "project" && " text-base text-justify text-slate-400 leading-6"}`}>{task.description ? task.description : `No ${type} description`}</p>
            <motion.button variants={ChildrenComponent} className="flex justify-center items-center"><img src={editIcon} className="w-6 h-6" /></motion.button>
            </motion.div>
      )}
    </>
  );
};

export default DescriptionComponent;
