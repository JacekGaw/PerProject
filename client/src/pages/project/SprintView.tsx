import React from "react";
import TaskItem from "./TaskItem";
import AddButton from "../../components/UI/AddButton";
import { Task } from "../../store/TasksContext";
import { SprintType } from "../../store/SprintsContext";
import DateFormatted from "../../components/UI/DateFormatted";
import Button from "../../components/UI/Button";

const SprintView: React.FC<{ sprint: SprintType; tasks: Task[] }> = ({
  sprint,
  tasks,
}) => {
  return (
    <>
      <div>
        <header className=" p-2 flex justify-between items-center gap-2">
          <div className="flex flex-col justify-center items-start gap-2">
            <h2 className="font-[300] text-light-blue text-xl">
              Sprint: {sprint.name}
            </h2>
            <p className="text-xs  inline-flex gap-2 font-[400] text-slate-400">
              <p>Target: {sprint.target} |</p>
              <DateFormatted label="From: " dateObj={sprint.dateFrom} />
              <DateFormatted label="To: " dateObj={sprint.dateTo} />
            </p>
          </div>
          <div className="relative flex items-center gap-5">
            <button >{sprint.status == "Active" ? "End Sprint" : "Start Sprint"}</button>
            <AddButton
              type="task"
              placeholder="Add task"
              sprintId={sprint.id}
            />
          </div>
        </header>
        {tasks && (
          <ul className="w-full flex flex-col gap-2">
            {tasks.map((task) => {
              return <TaskItem key={task.id} item={task} />;
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default SprintView;
