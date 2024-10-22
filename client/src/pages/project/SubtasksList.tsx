import React from "react";
import AddButton from "../../components/UI/AddButton";
import SubtaskListItem from "./SubtaskListItem";
import { useTasksCtx, SubTask } from "../../store/TasksContext";

interface SubtasksListProps {
  subtasks: SubTask[];
  taskId: number;
}

const SubtasksList: React.FC<SubtasksListProps> = ({ subtasks, taskId }) => {
  const { subtasksArr } = useTasksCtx();

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
            <SubtaskListItem key={subtask.id} subtask={subtask} />
          ))}
        </ul>
      )}
    </>
  );
};

export default SubtasksList;
