import React, { useState, useRef } from "react";
import AddButton from "../../components/UI/AddButton";
import SubtaskListItem from "./SubtaskListItem";
import { useTasksCtx, SubTask } from "../../store/TasksContext";
import ButtonOutlined from "../../components/UI/ButtonOutlined";
import { useCompanyCtx } from "../../store/CompanyContext";
import { useProjectCtx } from "../../store/ProjectsContext";
import Spinner from "../../components/UI/Spinner";
import Modal, {ModalRef} from "../../components/UI/Modal";
import GeneratedSubtasksModal from "./GeneratedSubtasksModal";

interface SubtasksListProps {
  subtasks: SubTask[];
  taskId: number;
}

const SubtasksList: React.FC<SubtasksListProps> = ({ subtasks, taskId }) => {
  const { subtasksArr, generateSubtasks } = useTasksCtx();
  const [buttonState, setButtonState] = useState<{disabled: boolean, content: string | React.ReactNode}>({disabled: false, content: "Generate"})
  const {company} = useCompanyCtx();
  const {project} = useProjectCtx()
  const modalRef = useRef<ModalRef | null>(null);
  const [generatedSubtasks, setGeneratedSubtasks] = useState<{taskText:string, description:string}[] | null>(null)

  const handleGenerate = async () => {
    try {
      setButtonState({disabled: true, content: <Spinner />})
      const response = await generateSubtasks(taskId, project!.id);
      if(response.status == "Error") {
        throw new Error(response.text);
      }
      if ("data" in response) {
        setGeneratedSubtasks(response.data);
        setButtonState({disabled: false, content: "Generate"})
        modalRef.current && modalRef.current.open();
      }
      
    } catch (err) {
      console.log(err);
      setButtonState({disabled: false, content: "Generate"})
    }
  }

  const handleCloseModal = () => {
    return modalRef.current && modalRef.current.close();
  }

  return (
    <>
    <Modal ref={modalRef}>
      {generatedSubtasks && <GeneratedSubtasksModal data={generatedSubtasks} />}
      
    </Modal>
      <header className="w-full flex gap-5 justify-between items-center p-2 border-b border-normal-blue">
        <h3 className="">Subtasks ({subtasks.length}):</h3>
        <div className="flex items-center gap-2">
          
        <div className="relative flex items-center">
          <AddButton type="subtask" placeholder="Add subtask" taskId={taskId} />
        </div>
        {company?.settings.AI.available && <ButtonOutlined disabled={buttonState.disabled} onClick={handleGenerate}>{buttonState.content}</ButtonOutlined>}
        
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
