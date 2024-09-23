import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { useProjectCtx } from "../../store/ProjectsContext";
import { motion } from "framer-motion";
import plusIcon from "../../assets/img/plus.svg";
import { useAuth } from "../../store/AuthContext";

const button = {
  open: { scale: 1, borderRadius: "50%" },
  close: { scale: 1, borderRadius: "0%" },
  hover: {scale: 1.05 }
};
const icon = {
  open: { rotate: 0 },
  close: { rotate: 45 },
};

const TaskList: React.FC = () => {
  const { tasks, addNewTask, project } = useProjectCtx();
const {user, logOut} = useAuth();
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsError(false);
    const formData = new FormData(e.currentTarget);
    const taskText = formData.get('taskText') as string;
    if(!user || !project) {
        return logOut();
    }
    const data = {
        taskText: taskText,
        authorId: user.id,
        projectId: project.id,
        assignedTo: user.id
    }
    try {
        const response = await addNewTask(data);
        if(response.status === "Success"){
            setInputVisible(false);
            setIsError(false);
        }
        else {
            setIsError(true);
        }
    } catch (err) {
        setIsError(true);
    }
  }

  return (
    <>
      <section>
        <header className=" p-2 flex justify-between items-center gap-2">
          <h2 className="font-[300] text-light-blue text-xl">Tasks:</h2>
          <div className="relative flex items-center">
            {inputVisible && 
            <motion.form className="absolute right-full z-10 flex px-2 gap-2" onSubmit={onSubmit}>
                <input name="taskText" id="taskText" type="text" placeholder="Task text" className={` text-base ${isError ? "bg-red-600" : "bg-darkest-blue" }`} required />
                <button type="submit" className="">Add</button>
            </motion.form>
            }
            
            <motion.button
              variants={button}
              initial="open"
              whileHover="hover"
              animate={inputVisible ? "close" : "open"}
              onClick={() => setInputVisible((prevState) => !prevState)}
              className="bg-gradient-to-r from-normal-orange to-vibrant-orange p-2 w-8 h-8 flex justify-center z-30 items-center"
            >
              <motion.img
                variants={icon}
                initial="open"
                animate={inputVisible ? "close" : "open"}
                src={plusIcon}
                alt="Add New Project"
                className="w-4"
              />
            </motion.button>
          </div>
        </header>
        {tasks && (
          <ul className="w-full flex flex-col gap-2">
            {tasks.map((task) => {
              return <TaskItem key={task.id} item={task} />;
            })}
          </ul>
        )}
      </section>
    </>
  );
};

export default TaskList;
