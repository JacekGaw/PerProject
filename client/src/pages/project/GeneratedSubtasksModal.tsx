import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../components/UI/Button";
import { useTasksCtx, Task } from "../../store/TasksContext";
import { useUserCtx } from "../../store/UserContext";

interface GeneratedSubtask {
  taskText: string;
  description: string;
  projectId?: number;
  authorId?: number;
}

interface GeneratedSubtasksModalProps {
  data: GeneratedSubtask[];
  currentProjectId: number;
  taskId: number;
}

const GeneratedSubtasksModal: React.FC<GeneratedSubtasksModalProps> = ({
  taskId,
  data,
  currentProjectId,
}) => {
  const [subtasks, setSubtasks] = useState<GeneratedSubtask[]>(data);
  const [checkedArr, setCheckedArr] = useState<number[]>([]);
  const { addNewTask } = useTasksCtx();
  const { user } = useUserCtx();

  const handleToggleCheckbox = (index: number) => {
    setCheckedArr(
      (prevCheckedArr) =>
        prevCheckedArr.includes(index)
          ? prevCheckedArr.filter((i) => i !== index) // Uncheck if already checked
          : [...prevCheckedArr, index] // Add if not checked
    );
  };

  const handleSelectAll = () => {
    setCheckedArr(subtasks.map((_, index) => index)); // Select all indices
  };

  const handleResetSelection = () => {
    setCheckedArr([]); // Clear all selections
  };

  const handleSaveChecked = async () => {
    const selectedSubtasks = subtasks
      .filter((_, index) => checkedArr.includes(index))
      .map((item) => ({
        ...item,
        projectId: currentProjectId,
        authorId: user!.id,
        taskId: taskId,
      })) as Partial<Task>[];

    console.log("Selected Subtasks:", selectedSubtasks);

    const response = await addNewTask("subtask", selectedSubtasks, true);

    if (response.status === "Success") {
      // Remove added subtasks from `subtasks` array
      setSubtasks((prevSubtasks) =>
        prevSubtasks.filter((_, index) => !checkedArr.includes(index))
      );
      // Reset checked array after deletion
      setCheckedArr([]);
    }
  };

  return (
    <div className="w-full max-w-screen-md flex flex-col gap-5 p-5">
      <header className="py-2 border-b flex flex-col gap-2 border-b-slate-400">
        <h1 className="text-xl font-[600]">Generated Subtasks</h1>
        <p className="text-xs font-[400] text-slate-400">
          Subtasks were generated based on your project title, description, task
          informations and added subtasks. AI can make mistakes. Select which
          ones you want to add. After adding you still have option to edit and
          delete them.
        </p>
      </header>
      {subtasks.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {subtasks.map((subtask, index) => (
            <motion.li
              key={subtask.taskText}
              onClick={() => handleToggleCheckbox(index)}
              className="flex gap-5 p-5 rounded-xl cursor-pointer"
              initial={{ backgroundColor: "#0C1A2E" }}
              animate={{
                backgroundColor: checkedArr.includes(index)
                  ? "#315993"
                  : "#0C1A2E",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="checkbox"
                checked={checkedArr.includes(index)}
                readOnly
                className="pointer-events-none"
              />
              <div className="flex flex-col gap-1">
                <h5 className="text-sm font-[600]">{subtask.taskText}</h5>
                <p className="text-xs font-[400] text-slate-400">
                  {subtask.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col p-5 justify-center items-center">
          <p className="font-[600] text-lg">No subtasks generated!</p>
          <p className="font-[400] text-sm text-slate-400">
            Probably current subtasks cover the entire scope of work. If you are
            not happy with the results, go ahead and try generate them again!
          </p>
        </div>
      )}

      <div className="flex justify-end gap-5 items-center">
        <button
          onClick={handleResetSelection}
          className="underline text-sm text-slate-200"
        >
          Reset Selection
        </button>
        <button
          onClick={handleSelectAll}
          className="underline text-sm text-slate-200"
        >
          Select All
        </button>
        <Button onClick={handleSaveChecked} disabled={subtasks.length == 0}>Save Checked</Button>
      </div>
    </div>
  );
};

export default GeneratedSubtasksModal;
