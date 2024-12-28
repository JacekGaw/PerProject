import React, { useState } from "react";
import { useTasksCtx, SubTask, Task } from "../../store/TasksContext";

interface PriorityProps {
    type?: "task" | "subtask";
  task: Task | SubTask;
}

type TaskPriority = "Low" | "Medium" | "High";

const Priority: React.FC<PriorityProps> = ({ type = "task", task }) => {
  const [editingPriority, setEditingPriority] = useState<boolean>(false);
  const { changeTask } = useTasksCtx();

  const changePriority = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const priority = event.target.value;
    console.log("Selected priority:", priority);

    if(priority === task.priority) {
        return;
    }
      try {
        await changeTask(type, task.id!, {priority: priority as TaskPriority});
        location.reload();
      } catch (err){
        console.log(err);
      }
  };

  return (
    <div
      onMouseEnter={() => setEditingPriority(true)}
      onMouseLeave={() => setEditingPriority(false)}
    >
      {editingPriority ? (
        <form className="p-1 flex flex-col gap-1 justify-center items-center">
          <input
            type="radio"
            id="high"
            value="High"
            name="priority"
            defaultChecked={task.priority === "High"}
            onChange={changePriority}
            className={`w-[10px] h-[10px] checked:bg-normal-orange rounded-full ${
              task.priority === "High" ? "bg-normal-orange" : "bg-slate-800"
            }`}
          />

          <input
            type="radio"
            id="medium"
            value="Medium"
            name="priority"
            defaultChecked={task.priority === "Medium"}
            onChange={changePriority}
            className={`w-[10px] h-[10px] bg-normal-orange rounded-full ${
              task.priority === "Medium" ? "bg-normal-orange" : "bg-slate-800"
            }`}
          />

          <input
            type="radio"
            id="low"
            value="Low"
            name="priority"
            defaultChecked={task.priority === "Low"}
            onChange={changePriority}
            className={`w-[10px] h-[10px] rounded-full ${
              task.priority === "Low" ? "bg-light-blue" : "bg-slate-800"
            }`}
          />
        </form>
      ) : (
        <div className="p-1 flex flex-col gap-1 justify-center items-center">
          <p
            className={`w-[7px] h-[7px] rounded-full ${
              task.priority === "High" ? "bg-red-600" : "bg-slate-800"
            }`}
          ></p>
          <p
            className={`w-[7px] h-[7px] rounded-full ${
              task.priority == "Low" && "bg-slate-800"
            }   ${task.priority === "Medium" && "bg-normal-orange"} ${
              task.priority === "High" && "bg-red-600"
            }`}
          ></p>
          <p
            className={`w-[7px] h-[7px] rounded-full bg-light-blue ${
              task.priority === "High" && "bg-red-600"
            } ${task.priority === "Medium" && "bg-normal-orange"}`}
          ></p>
        </div>
      )}
    </div>
  );
};

export default Priority;
