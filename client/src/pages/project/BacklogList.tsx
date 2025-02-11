import React, {useRef} from "react";
import AddButton from "../../components/UI/AddButton";
import { Task } from "../../store/TasksContext";
import Modal, {ModalRef} from "../../components/UI/Modal";
import NewSprintForm from "./NewSprintForm";
import SortableTaskItem from "./SortableTaskItem";

const BacklogList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const modalRef = useRef<ModalRef | null>(null);


  return (
    <>
    <Modal ref={modalRef} >
        <NewSprintForm tasks={tasks} exit={() => modalRef.current?.close()} />
    </Modal>
      <div className="bg-darkest-blue rounded-lg p-5">
        <header className=" p-2 flex justify-between items-center gap-2">
            <div className="flex justify-center items-center gap-2">
          <h2 className="font-[300] text-light-blue text-xl">Backlog:</h2>
          </div>
          <div className="relative flex items-center gap-5">
          <AddButton type="task" placeholder="Add task" />
          <button onClick={() => modalRef.current && modalRef.current.open()} >Create Sprint</button>
          </div>
        </header>
        {tasks && (
          <ul className="w-full flex flex-col gap-2 p-2">
            {tasks.map((task) => {
              return <SortableTaskItem key={task.id} item={task} />;
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default BacklogList;
