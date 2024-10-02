import React from "react";
import { SubtaskType } from "../../store/ProjectsContext";
import AddButton from "../../components/UI/AddButton";
import taskIcon from "../../assets/img/taskIcon.svg";
import { useProjectCtx } from "../../store/ProjectsContext";
import ChangeUser from "../../components/UI/ChangeUser";
import Priority from "../../components/UI/Priority";
interface SubtasksListProps {
  subtasks: SubtaskType[];
  taskId: number;
}

const taskStatuses = ["To Do", "In Progress", "On Hold", "Done"];
type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";

const SubtasksList: React.FC<SubtasksListProps> = ({ subtasks, taskId }) => {
  const { changeTask, subtasksArr } = useProjectCtx();

  const changeStatus = async (subtaskId: number, newStatus: TaskStatus) => {
    try {
      console.log(subtaskId, newStatus);
      const response = await changeTask("subtask", subtaskId, { status: newStatus });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <header className="w-full flex gap-5 justify-between items-center p-2 border-b border-normal-blue">
        <h3 className="">Subtasks ({subtasks.length}):</h3>
        <div className="relative flex items-center">
          <AddButton type="subtask" placeholder="Add subtask" taskId={taskId} />
        </div>
      </header>
      {subtasksArr && subtasksArr.length > 0 && (
        <ul>
          {subtasksArr.map((subtask) => (
            <li
              key={subtask.id}
              className="p-2 border-b border-slate-600 flex justify-between  items-center gap-5"
            >
              <img src={taskIcon} className="max-w-4 fill-slate-100" />
              <p className="w-full">{subtask.taskText}</p>
              <select
                value={subtask.status}
                onChange={(e) => changeStatus(subtask.id, e.target.value as TaskStatus)}
                className="bg-darkest-blue text-sm p-2 rounded-sm"
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChangeUser item={subtask} type="subtask" />
              <Priority priority={subtask.priority} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SubtasksList;
