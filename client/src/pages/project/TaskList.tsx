import React from "react";

import { useTasksCtx } from "../../store/TasksContext";
import { useSprintsCtx } from "../../store/SprintsContext";
import BacklogList from "./BacklogList";
import SprintView from "./SprintView";

const TaskList: React.FC = () => {
  const {tasks} = useTasksCtx();
  const {sprints} = useSprintsCtx();
  
  console.log("TASKS", tasks);
  console.log(tasks!.filter(task => task.sprintId == 1));
  return (
    <>
    <section className="flex flex-col gap-10">
      {sprints.active && tasks && sprints.active.map((sprint) => {
        console.log(sprint)
        return <SprintView sprint={sprint} tasks={tasks.filter((task) => task.sprintId == sprint.id)} />
      })}
      {sprints.planning && tasks && sprints.planning.map((sprint) => {
        return <SprintView sprint={sprint} tasks={tasks.filter((task) => task.sprintId == sprint.id)} />
      })}
      {tasks && <BacklogList tasks={tasks.filter((task) => task.sprintId == null)} />}    
    </section>
      
    </>
  );
};

export default TaskList;
