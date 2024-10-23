import React, { useState } from "react";
import { motion } from "framer-motion";
import saveIcon from "../../assets/img/check.svg"
import exitIcon from "../../assets/img/close.svg"
import { useTasksCtx, Task, SubTask } from "../../store/TasksContext";

const ParentContainer = {
    init:{opacity: 1},
    show:{opacity:1, scale: 1.1}
}


interface EstimatedTimeProps {
  type?: "subtask" | "task";
  task: Task | SubTask;
}

const EstimatedTime: React.FC<EstimatedTimeProps> = ({
  type = "task",
  task,
}) => {
  const [editTime, setEditTime] = useState<boolean>(false);
  const { changeTask} = useTasksCtx();

  const changeTime =  async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const estimatedTime= formData.get("estimatedTime") as number | null;
    try {
      await changeTask(type, task.id!, {estimatedTime: estimatedTime});
      setEditTime(false);
      location.reload();
    } catch (err){
      console.log(err);
      setEditTime(false);
    }
  }


  return (
    <>
      {editTime ? (
        <form className="flex gap-2 justify-between" onSubmit={changeTime}>
          <input type="number" min={0} name="estimatedTime" id="estimatedTime" defaultValue={task.estimatedTime ? task.estimatedTime : 0} className=" bg-darkest-blue border border-slate-500 rounded-full w-12 h-10 p-2"></input>
          <div className="">
            <button type="submit" className="border border-slate-600 p-1 rounded-md flex justify-center items-center"><img src={saveIcon} className="w-2 max-h-4" /></button>
            <button onClick={() => setEditTime(false)} className="border border-slate-600 p-1 rounded-md flex justify-center items-center"><img src={exitIcon} className="w-2 max-h-4" /></button>
          </div>
        </form>
      ) : (
        <motion.div variants={ParentContainer} onClick={() => setEditTime(true)} initial="init" whileHover="show"  className="cursor-pointer font-[200] text-sm p-2 flex gap-2 justify-between" >
            <p className="bg-darkest-blue p-2 flex justify-center items-center rounded-full w-10 h-10 text-lg">{task.estimatedTime}</p>
            </motion.div>
      )}
    </>
  );
};

export default EstimatedTime;
