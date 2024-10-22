import React, { useState } from "react";
import { motion } from "framer-motion";
import saveIcon from "../../assets/img/check.svg"
import exitIcon from "../../assets/img/close.svg"
import editIcon from "../../assets/img/edit.svg"
import { useTasksCtx, Task, SubTask } from "../../store/TasksContext";


const ParentContainer = {
    init:{opacity: 1},
    show:{opacity:1}
}

const ChildrenComponent = {
    init:{opacity: 0},
    show:{opacity:1}
}

interface TitleComponentProps {
  type?: "subtask" | "task";
  task: Task | SubTask;
}

const TitleComponent: React.FC<TitleComponentProps> = ({
  type = "task",
  task,
}) => {
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const { changeTask} = useTasksCtx();


  const changeTitle = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTitle = formData.get("taskText") as string;
    if(newTitle === task.taskText) {
      setEditTitle(false)
      return;
    }
    try {
      await changeTask(type, task.id!, {taskText: newTitle});
      setEditTitle(false);
      location.reload();
    } catch (err){
      console.log(err);
      setEditTitle(false);
    }
  }


  return (
    <>
      {editTitle ? (
        <form className="flex gap-2 justify-between" onSubmit={changeTitle}>
          <input type="text" name="taskText" id="description" defaultValue={task.taskText} className="w-full bg-darkest-blue border border-slate-500 rounded-md p-2"></input>
          <div className="">
            <button type="submit" className="border border-slate-600 p-2 rounded-md flex justify-center items-center"><img src={saveIcon} className="w-4 max-h-6" /></button>
            <button onClick={() => setEditTitle(false)} className="border border-slate-600 p-2 rounded-md flex justify-center items-center"><img src={exitIcon} className="w-4 max-h-6" /></button>
          </div>
        </form>
      ) : (
        <motion.div variants={ParentContainer} onClick={() => setEditTitle(true)} initial="init" whileHover="show"  className="w-full cursor-pointer font-[200] text-sm p-2 flex gap-2 justify-between" >
            {type == 'task' ? <h1 className="font-[500] text-2xl">{task.taskText}</h1> : <p className="w-full">{task.taskText}</p>}
            
            <motion.button variants={ChildrenComponent} className=""><img src={editIcon} className="w-4 max-h-6" /></motion.button>
            </motion.div>
      )}
    </>
  );
};

export default TitleComponent;