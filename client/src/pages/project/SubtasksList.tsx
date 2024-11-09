import React from "react";
import AddButton from "../../components/UI/AddButton";
import SubtaskListItem from "./SubtaskListItem";
import { useTasksCtx, SubTask } from "../../store/TasksContext";
import ButtonOutlined from "../../components/UI/ButtonOutlined";
import { useCompanyCtx } from "../../store/CompanyContext";
import { useProjectCtx } from "../../store/ProjectsContext";

interface SubtasksListProps {
  subtasks: SubTask[];
  taskId: number;
}

const SubtasksList: React.FC<SubtasksListProps> = ({ subtasks, taskId }) => {
  const { subtasksArr, generateSubtasks } = useTasksCtx();
  const {company} = useCompanyCtx();
  const {project} = useProjectCtx()

  const handleGenerate = async () => {
    try {
      await generateSubtasks(taskId, project!.id);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <header className="w-full flex gap-5 justify-between items-center p-2 border-b border-normal-blue">
        <h3 className="">Subtasks ({subtasks.length}):</h3>
        <div className="flex items-center gap-2">
          
        <div className="relative flex items-center">
          <AddButton type="subtask" placeholder="Add subtask" taskId={taskId} />
        </div>
        {company?.settings.AI.available && <ButtonOutlined onClick={handleGenerate}>Generate</ButtonOutlined>}
        
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
