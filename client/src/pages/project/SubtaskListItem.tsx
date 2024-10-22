import React, {useState} from 'react';
import { useTasksCtx, SubTask
} from "../../store/TasksContext";
import taskIcon from "../../assets/img/taskIcon.svg";
import ChangeUser from "../../components/UI/ChangeUser";
import Priority from "../../components/UI/Priority";
import TitleComponent from './TitleComponent';


interface SubtaskListItemProps {
    subtask: SubTask
}

type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";
const taskStatuses = ["To Do", "In Progress", "On Hold", "Done"];



const SubtaskListItem: React.FC<SubtaskListItemProps> = ({subtask}) => {
    const {changeTask} = useTasksCtx()
    const [editingSubtask, setEditingSubtask] = useState<boolean>(false);

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
        <li
              key={subtask.id}
              className="p-2 border-b border-slate-600 flex justify-between  items-center gap-5"
            >
              <img src={taskIcon} className="max-w-4 fill-slate-100" />
              
              
            <TitleComponent type='subtask' task={subtask} />
              {/* <p className="w-full">{subtask.taskText}</p> */}
              <select
                value={subtask.status}
                onChange={(e) => changeStatus(subtask.id!, e.target.value as TaskStatus)}
                className="bg-darkest-blue text-sm p-2 rounded-sm"
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChangeUser item={subtask} type="subtask" />
              <Priority type='subtask' task={subtask} />
            </li>
        </>
    )
}

export default SubtaskListItem;