import React, { useRef } from "react";
import Priority from "../../components/UI/Priority";
import { useTasksCtx, SubTask } from "../../store/TasksContext";
import DateFormatted from "../../components/UI/DateFormatted";

interface SubtaskItemProps {
  item: SubTask;
}

type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";

const taskStatuses = ["To Do", "In Progress", "On Hold", "Done"];

const SubtaskItem: React.FC<SubtaskItemProps> = ({ item }) => {
  const { changeTask } = useTasksCtx();

  const statusRef = useRef<HTMLSelectElement>(null);

  const changeStatus: () => Promise<void> = async () => {
    if (!statusRef.current) {
      return;
    }
    const validStatuses: TaskStatus[] = [
      "To Do",
      "In Progress",
      "On Hold",
      "Done",
    ];
    const newStatus = statusRef.current.value as TaskStatus;
    if (!validStatuses.includes(newStatus)) {
      console.error("Invalid status value");
      return;
    }
    try {
      const response = await changeTask("subtask", item.id!, {
        status: newStatus,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <li key={item.id} className="flex justify-between items-center gap-5 p-2 border-l-4 border-dark-blue">
        <h5 className="truncate text-sm text-slate-200">{item.taskText}</h5>
        <div className="flex justify-between items-center gap-5">
        <DateFormatted dateObj={item.createdAt!} time={false} />
        <select
          value={item.status}
          onChange={changeStatus}
          ref={statusRef}
          className="bg-darkest-blue text-sm p-2 rounded-sm"
        >
          {taskStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        
        </div>
      </li>
    </>
  );
};

export default SubtaskItem;
