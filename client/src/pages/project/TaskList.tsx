import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { useProjectCtx } from "../../store/ProjectsContext";
import { motion } from "framer-motion";
import plusIcon from "../../assets/img/plus.svg";
import { useAuth } from "../../store/AuthContext";
import AddButton from "../../components/UI/AddButton";

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
  const { tasks} = useProjectCtx();

  return (
    <>
      <section>
        <header className=" p-2 flex justify-between items-center gap-2">
          <h2 className="font-[300] text-light-blue text-xl">Tasks:</h2>
          <div className="relative flex items-center">
            <AddButton type="task" placeholder="Add task" />
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
