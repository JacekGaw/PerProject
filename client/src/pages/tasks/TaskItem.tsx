import React, { useRef, useState } from "react";
import errorIcon from "../../assets/img/errorIcon.svg";
import taskIcon from "../../assets/img/taskIcon.svg";
import storyIcon from "../../assets/img/storyIcon.svg";
import Priority from "../../components/UI/Priority";
import { useTasksCtx, TaskWithSubtasks } from "../../store/TasksContext";
import { Link } from "react-router-dom";
import DateFormatted from "../../components/UI/DateFormatted";
import SubtaskItem from "./SubtaskItem";
import { motion, AnimatePresence } from "framer-motion";
import downArrowIcon from "../../assets/img/down_arrow.svg";

interface taskType {
  type: string;
  icon: string;
}

interface TaskItemProps {
  item: TaskWithSubtasks;
}

type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";

const taskStatuses = ["To Do", "In Progress", "On Hold", "Done"];
const taskTypes: taskType[] = [
  { type: "Task", icon: taskIcon },
  { type: "Story", icon: storyIcon },
  { type: "Error", icon: errorIcon },
];

const TaskItem: React.FC<TaskItemProps> = ({ item }) => {
  const { changeTask } = useTasksCtx();
  const [subtasksOpen, setSubtasksOpen] = useState<boolean>(false);

  const statusRef = useRef<HTMLSelectElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const taskType: taskType = taskTypes.filter(
    (typeFromArr) => item.type == typeFromArr.type
  )[0];

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
      const response = await changeTask("task", item.id, { status: newStatus });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const openSelect = () => selectRef.current && selectRef.current.focus();

  return (
    <>
      <div className="flex gap-2 w-full items-center justify-between p-2  bg-darkest-blue bg-opacity-50 rounded-sm">
        <div
          onClick={openSelect}
          className={`w-24 relative  flex justify-left items-center gap-1 text-xs p-2`}
        >
          <img src={taskType.icon} className="max-w-4 fill-slate-100" />
          <p className="font-[200]">{taskType.type}</p>
        </div>
        <Link
          to={`/dashboard/projects/${item.project.alias}/task/${item.id}`}
          className=" w-full font-[300] flex flex-col justify-start items-start"
        >
          <h5 className="block text-left w-full font-[300]">{item.taskText}</h5>
          <Link
            to={`/dashboard/projects/${item.project.alias}`}
            className="block text-xs font-[500] text-slate-500 hover:text-blue-400"
          >
            <span>({item.project.alias})</span> {item.project.name}
          </Link>
        </Link>
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
        <Priority priority={item.priority} />
      </div>
      {item.subTasks.length > 0 && (
        <div className="py-2 px-10">
          <p className="flex items-center">
            <span className="flex-grow max-w-[40px] border-b  border-slate-600 mx-2"></span>

            <button
              onClick={() => setSubtasksOpen((p) => !p)}
              className=" flex justify-center items-center gap-2 "
            >
                <motion.img
                initial={{rotate: 0}}
                animate={subtasksOpen ? {rotate: 180}: {rotate: 0}}
                src={downArrowIcon} className="w-3" />
              <p className="text-slate-300 text-sm font-[300]">Subtasks ({item.subTasks.length}):{" "}</p>
            </button>
            <span className="flex-grow border-b  border-slate-600 mx-2"></span>
          </p>
          <AnimatePresence mode="sync">
            {subtasksOpen && (
              <motion.ul
                initial={{ height: 0 }}
                animate={subtasksOpen ? { height: "auto" } : { height: 0 }}
                exit={{ height: 0 }}
                className="overflow-hidden flex flex-col gap-2"
              >
                {item.subTasks.map((subtask) => {
                  return <SubtaskItem key={subtask.taskText} item={subtask} />;
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default TaskItem;
