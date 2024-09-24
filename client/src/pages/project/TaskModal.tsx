import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import closeIcon from "../../assets/img/close.svg";
import axios from "axios";
import { useProjectCtx } from "../../store/ProjectsContext";
// import moreIcon from "../../assets/img/vertical_dots.svg"
import deleteIcon from "../../assets/img/delete.svg"

interface TaskType {
    id: number,
    taskText: string;
    description?: string;
    createdAt: Date,
    updatedAt: Date | null;
    type: "Task" | "Story" | "Error";  // Use string literals here
    priority: "Low" | "Medium" | "High";  // Match your DB enums
    estimatedTime: number | null;
    status: "To Do" | "In Progress" | "On Hold" | "Done";  // Match DB enums
    assignedTo: number;
    authorId: number;
    projectId: number;
}
interface SubtaskType {
    id: number,
    taskText: string;
    description?: string;
    createdAt: Date,
    updatedAt: Date | null;
    type: "Task" | "Story" | "Error";  // Use string literals here
    priority: "Low" | "Medium" | "High";  // Match your DB enums
    estimatedTime: number | null;
    status: "To Do" | "In Progress" | "On Hold" | "Done";  // Match DB enums
    assignedTo: number;
    authorId: number;
    taskId: number;
}

const TaskModal: React.FC = () => {
  const { alias } = useParams();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const {deleteTask} = useProjectCtx();
  const {task, subtasks}= useLoaderData() as {task: TaskType, subtasks: SubtaskType} ;

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }

    // Event listener to handle clicking outside the modal
    const handleBackdropClick = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        navigate(`/dashboard/projects/${alias}`);
      }
    };

    // Attach the event listener
    if (modalRef.current) {
      modalRef.current.addEventListener("click", handleBackdropClick);
    }

    // Clean up the event listener on component unmount
    
  }, [alias, navigate]);

  const handleClose = () => {
    return navigate(`/dashboard/projects/${alias}`);
  };

  const handleDeleteTask = async () => {
    try {
        const response = await deleteTask(task.id)
        if(response.status !== "Success") {
            throw new Error(response.text)
        }
        else {
            return navigate(`/dashboard/projects/${alias}`, {replace: true})
        }
    } catch (err) {
        console.log(err)
    }
  }

  return (
    <div className="relative">
      <dialog
        ref={modalRef}
        className={`mr-0 my-0 top-[0%] right-[0%]  left-100 w-auto max-w-screen-sm h-screen backdrop:bg-slate-900/80 bg-dark-blue text-slate-200  shadow-lg`}
      >
        <form method="dialog" className="absolute left-2 top-2  flex justify-end">
          <motion.button
            initial={{ x: 0, y: 0 }}
            whileHover={{ x: -2, y: 2 }}
            onClick={handleClose}
            className="p-2 z-50 border rounded-full border-slate-600"
          >
            <img src={closeIcon} alt="Close Modal" className="w-4 h-4" />
          </motion.button>
        </form>
        <div className="h-full p-10">
        <header className="py-5 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-5">
            <h1 className="font-[500] text-2xl">{task.taskText}</h1>
                <button onClick={handleDeleteTask} className="flex w-4 h-4 justify-center items-center">
                    <img src={deleteIcon} className="w-full" />
                </button>
            </div>
            {task.description ? <p className="font-[200] text-sm p-2 border-b">{task.description}</p> : <p className="font-[200] text-sm p-2 border-b">No task description</p>}
        </header>
        <div className="flex gap-2 justify-center items-center">
            <div>
                <label htmlFor="type">Type:</label>
                <select name="type" id="type" defaultValue={task.type}>
                    <option value="Task">Task</option>
                    <option value="Story">Story</option>
                    <option value="Error">Error</option>
                </select>
            </div>
            <div>
                <label htmlFor="priority">Priority:</label>
                <select name="priority" id="priority" defaultValue={task.priority}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div>
                <label htmlFor="status">Status:</label>
                <select name="status" id="status" defaultValue={task.status}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Done">Done</option>
                </select>
            </div>
        </div>
        </div>
      </dialog>
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
      const response = await axios.get(
        `http://localhost:3002/api/task/${id}`
      );
      console.log(response);
      return {
        task: response.data.data.task,
        subtasks: response.data.data.subtasks,
      };
    } catch (err) {
      throw new Response(`Task and subtasks: ${err}`, { status: 404 });
    }
  };
