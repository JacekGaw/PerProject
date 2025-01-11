import React, { useRef, useEffect } from "react";
import {
  useParams,
  useNavigate,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { motion } from "framer-motion";
import closeIcon from "../../assets/img/close.svg";
import deleteIcon from "../../assets/img/delete.svg";
import { CompanyUserType, useCompanyCtx } from "../../store/CompanyContext";
import SubtasksList from "./SubtasksList";
import UserAvatar from "../../components/UI/UserAvatar";
import DescriptionComponent from "./DescriptionComponent";
import TitleComponent from "./TitleComponent";
import EstimatedTime from "./EstimatedTime";
import { useTasksCtx, Task, SubTask } from "../../store/TasksContext";
import DateFormatted from "../../components/UI/DateFormatted";
import api from "../../api/api";

const DialogMotion = {
  hidden: {x: 500, opacity: 0},
  show: {x: 0, opacity: 1, transition: {staggerChildren: 0.2}}
}

const ChildrenMotion = {
  hidden: {x: -100, opacity: 0},
  show: {x: 0, opacity: 1},
}


const TaskModal: React.FC = () => {
  const { alias } = useParams();
  const { task, subtasks } = useLoaderData() as {
    task: Task;
    subtasks: SubTask[];
  };
  const modalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

    const { deleteTask, changeTask, setSubtasksArr, subtasksArr } =
    useTasksCtx();
  const { companyUsers } = useCompanyCtx();


  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
    if (subtasks) {
      setSubtasksArr(subtasks);
    }
    const handleBackdropClick = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        navigate(`/dashboard/projects/${alias}`);
      }
    };
    if (modalRef.current) {
      modalRef.current.addEventListener("click", handleBackdropClick);
    }
  }, [alias, navigate]);

  const handleClose = () => navigate(`/dashboard/projects/${alias}`);

  const handleDeleteTask = async () => {
    try {
      const response = await deleteTask("task",task.id);
      if (response.status !== "Success") {
        throw new Error(response.text);
      } else {
        return navigate(`/dashboard/projects/${alias}`, { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    try {
      await changeTask("task", task.id, { [name]: value });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="relative">
      <motion.dialog
      variants={DialogMotion}
      initial="hidden"
      animate="show"
      transition={{duration: 0.5, type: "spring"}}
        ref={modalRef}
        className={`mr-0 my-0 top-[0%] right-[0%]  left-100 w-auto max-w-screen-sm h-screen backdrop:bg-slate-900/80 bg-dark-blue text-slate-200  shadow-lg`}
      >
        <form
          method="dialog"
          className="absolute left-2 top-2  flex justify-end"
        >
          <motion.button
            initial={{ x: 0, y: 0 }}
            whileHover={{ x: -2, y: 2 }}
            onClick={handleClose}
            className="p-2 z-50 border rounded-full border-slate-600"
          >
            <img src={closeIcon} alt="Close Modal" className="w-4 h-4" />
          </motion.button>
        </form>
        <div className="h-full p-12 flex flex-col gap-5">
          <motion.div variants={ChildrenMotion}  className="flex gap-5 justify-between items-center">
            <DateFormatted label="Created:" dateObj={task.createdAt} time={true} />
            <DateFormatted label="Updated:" dateObj={task.updatedAt} />
          </motion.div>
          <motion.header className=" flex flex-col gap-2" variants={ChildrenMotion}>
            <div className="flex justify-between items-center gap-5">
              <div className="w-full"><TitleComponent task={task} /></div>
              
              <button
                onClick={handleDeleteTask}
                className="flex w-4 h-4 justify-center items-center"
              >
                <img src={deleteIcon} className="w-full" />
              </button>
            </div>
            <DescriptionComponent task={task} />
            
          </motion.header>
          <motion.div variants={ChildrenMotion} className="flex gap-5 justify-center items-center bg-darkest-blue p-5 rounded-md">
            <div className="flex-1 group hover:cursor-pointer flex flex-col gap-1">
              <label
                className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
                htmlFor="type"
              >
                Type:
              </label>
              <select
                onChange={handleChange}
                className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                name="type"
                id="type"
                defaultValue={task.type}
              >
                <option value="Task">Task</option>
                <option value="Story">Story</option>
                <option value="Error">Error</option>
              </select>
            </div>
            <div className="flex-1 group hover:cursor-pointer flex flex-col gap-1">
              <label
                className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
                htmlFor="priority"
              >
                Priority:
              </label>
              <select
                onChange={handleChange}
                className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                name="priority"
                id="priority"
                defaultValue={task.priority}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="flex-1 group hover:cursor-pointer flex flex-col gap-1">
              <label
                className="font-[100] group-hover:translate-x-2 group-focus-within:translate-x-2 group-focus-within:font-[500] transition-all duration-200"
                htmlFor="status"
              >
                Status:
              </label>
              <select
                onChange={handleChange}
                className="bg-inherit border border-slate-500 group-hover:border-slate-200 transition-all duration-200 rounded-md p-2 text-sm"
                name="status"
                id="status"
                defaultValue={task.status}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </motion.div>
          <motion.div variants={ChildrenMotion} className="w-full flex justify-between px-2 gap-10 items-center">
            <div className="flex gap-2 items-center">
              <p>Author</p>
              <UserAvatar
                orientation="bottom"
                user={companyUsers.find(
                  (companyUsers: CompanyUserType) =>
                    companyUsers.id == task.authorId
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <p>Assigned</p>
              <UserAvatar
                orientation="bottom"
                user={companyUsers.find(
                  (companyUsers) => companyUsers.id == task.assignedTo
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <p>Estimated Time</p>
              <EstimatedTime task={task} />
            </div>
          </motion.div>
          <motion.div variants={ChildrenMotion}>
            {subtasksArr && (
              <SubtasksList subtasks={subtasksArr} taskId={task.id} />
            )}
          </motion.div>
        </div>
      </motion.dialog>
    </div>
  );
};

export default TaskModal;

export const taskLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<{ task: object; subtasks: object[] }> => {
  const id = params.id;

  if (!id) {
    throw new Response("Missing task id", { status: 400 });
  }
  try {
    const response = await api.get(`/api/task/${id}`);
    console.log(response);
    return {
      task: response.data.data.task,
      subtasks: response.data.data.subtasks,
    };
  } catch (err) {
    throw new Response(`Task and subtasks: ${err}`, { status: 404 });
  }
};
