import React, { useState } from "react";
import { useTasksCtx, SubTask } from "../../store/TasksContext";
import taskIcon from "../../assets/img/taskIcon.svg";
import ChangeUser from "../../components/UI/ChangeUser";
import Priority from "../../components/UI/Priority";
import TitleComponent from "./TitleComponent";
import downArrow from "../../assets/img/down_arrow.svg";
import deleteIcon from "../../assets/img/delete.svg";

import DescriptionComponent from "./DescriptionComponent";
import UserAvatar from "../../components/UI/UserAvatar";
import { useCompanyCtx } from "../../store/CompanyContext";
import DateFormatted from "../../components/UI/DateFormatted";
import EstimatedTime from "./EstimatedTime";

interface SubtaskListItemProps {
  subtask: SubTask;
}

type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";
const taskStatuses = ["To Do", "In Progress", "On Hold", "Done"];

const SubtaskListItem: React.FC<SubtaskListItemProps> = ({ subtask }) => {
  const { changeTask, deleteTask } = useTasksCtx();
  const [subtaskDetailsOpen, setSubtaskDetailsOpen] = useState<boolean>(false);
  const { companyUsers } = useCompanyCtx();

  const changeStatus = async (subtaskId: number, newStatus: TaskStatus) => {
    try {
      console.log(subtaskId, newStatus);
      const response = await changeTask("subtask", subtaskId, {
        status: newStatus,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteTask("subtask", subtask.id!)
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li className="flex flex-col gap-2">
      <div className="relative group p-2 border-b border-slate-600 flex justify-between  items-center gap-5">
        <img src={taskIcon} className="max-w-4 fill-slate-100" />
        <TitleComponent type="subtask" task={subtask} />
        {/* <p className="w-full">{subtask.taskText}</p> */}
        <select
          value={subtask.status}
          onChange={(e) =>
            changeStatus(subtask.id!, e.target.value as TaskStatus)
          }
          className="bg-darkest-blue text-sm p-2 rounded-sm"
        >
          {taskStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <ChangeUser item={subtask} type="subtask" />
        <Priority type="subtask" task={subtask} />
        <button
          onClick={() => setSubtaskDetailsOpen((p) => !p)}
          className="hidden absolute bg-dark-blue left-0 z-50 top-0 h-full group-hover:flex justify-center items-center p-2"
        >
          <img
            className={`${subtaskDetailsOpen && "rotate-180"} w-6 h-6`}
            src={downArrow}
            alt="Delete subtask"
          />
        </button>
      </div>
      {subtaskDetailsOpen && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 justify-center items-center">
                <p>Author: </p>
                <UserAvatar
                  user={
                    companyUsers.filter(
                      (user) => user.id == subtask.authorId
                    )[0]
                  }
                  orientation="right"
                />
              </div>
              <DateFormatted label="Created: " dateObj={subtask.createdAt!} />
              <DateFormatted label="Updated: " dateObj={subtask.updatedAt!} />
              <EstimatedTime type="subtask" task={subtask} />
              <button onClick={handleDelete}><img className="w-4 h-4" src={deleteIcon} alt="Delete subtask" /></button>
            </div>
          </div>
          <DescriptionComponent type="subtask" task={subtask} />
        </div>
      )}
    </li>
  );
};

export default SubtaskListItem;
