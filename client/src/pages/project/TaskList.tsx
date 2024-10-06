import React from "react";
import TaskItem from "./TaskItem";
import AddButton from "../../components/UI/AddButton";
import { useTasksCtx } from "../../store/TasksContext";


const TaskList: React.FC = () => {
  const { tasks} = useTasksCtx();

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
