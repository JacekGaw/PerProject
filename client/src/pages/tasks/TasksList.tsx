import React from "react";
import TaskItem from "./TaskItem";
import { useTasksCtx } from "../../store/TasksContext";


const TasksList: React.FC = () => {
    const { userAllTasks } = useTasksCtx();
  return (
  <>
    <ul className="flex flex-col gap-1">
        {userAllTasks && userAllTasks.map(task => {
            return (<TaskItem item={task} key={task.id}/>)
        })}
    </ul>
  </>
  );
};

export default TasksList;
