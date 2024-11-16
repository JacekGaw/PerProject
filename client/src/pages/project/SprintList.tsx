import React, { useRef, useState } from "react";
import AddButton from "../../components/UI/AddButton";
import { Task } from "../../store/TasksContext";
import { SprintType, useSprintsCtx } from "../../store/SprintsContext";
import DateFormatted from "../../components/UI/DateFormatted";
import dotsIcon from "../../assets/img/vertical_dots.svg";
import Modal, { ModalRef } from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import ButtonOutlined from "../../components/UI/ButtonOutlined";
import EditSprintForm from "./EditSprintForm";
import EndSprintConfirm from "./EndSprintConfirm";
import SortableTaskItem from "./SortableTaskItem";

const SprintList: React.FC<{ sprint: SprintType; tasks: Task[] }> = ({
  sprint,
  tasks,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const { deleteSprint, changeSprintStatus } = useSprintsCtx();
  const deleteModalRef = useRef<ModalRef | null>(null);
  const editModalRef = useRef<ModalRef | null>(null);
  const endSprintRef = useRef<ModalRef | null>(null);

  const handleDelete = async () => {
    try {
      setButtonDisabled(true);
      const response = await deleteSprint(sprint);
      if (response.status == "Success") {
        setButtonDisabled(false);
      }
    } catch (err) {
      setButtonDisabled(false);
    }
  };

  const handleChangeSprintStatus = async () => {
    try {
      setButtonDisabled(true);
      const newSprintStatus = "Active";
      const response = await changeSprintStatus(sprint.id, newSprintStatus);
      if (response.status == "Success") {
        setButtonDisabled(false);
      }
    } catch (err) {
      setButtonDisabled(false);
    }
  };

  return (
    <>
      <Modal ref={endSprintRef}>
        <EndSprintConfirm
          sprintData={sprint}
          exit={() => endSprintRef.current?.close()}
          tasksArr={tasks}
        />
      </Modal>
      <Modal ref={editModalRef}>
        <EditSprintForm
          sprintData={sprint}
          exit={() => editModalRef.current?.close()}
        />
      </Modal>
      <Modal ref={deleteModalRef}>
        <div className="w-full max-w-screen-md flex flex-col gap-5 p-5">
          <header className="py-2 border-b flex flex-col gap-2 border-b-slate-400">
            <h1 className="text-xl font-[600]">
              Are you sure you want to delete sprint {sprint.name}?
            </h1>
            <p className="text-xs font-[400] text-slate-400">
              Note, that this operation is irreversable!
            </p>
          </header>
          <div className="flex justify-center items-center gap-2 ">
            <Button onClick={() => deleteModalRef.current?.close()}>
              Exit
            </Button>
            <ButtonOutlined disabled={buttonDisabled} onClick={handleDelete}>
              Delete
            </ButtonOutlined>
          </div>
        </div>
      </Modal>
      <div>
        <header className="py-2 flex justify-between items-center gap-2">
          <div className="flex flex-col justify-center items-start gap-2">
            <h2 className=" font-[300] text-light-blue text-xl flex items-center gap-2">
              <div className="relative rounded-md group p-2 bg-black-blue hover:bg-darkest-blue">
                <img src={dotsIcon} className=" max-w-2 w-1 h-auto" />
                <div className="z-50 cursor-pointer group-hover:flex absolute left-[100%] top-0  hidden flex-col">
                  <button
                    onClick={() =>
                      editModalRef.current && editModalRef.current.open()
                    }
                    className="text-sm bg-darkest-blue hover:bg-dark-blue py-2 px-4 font-[400]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deleteModalRef.current && deleteModalRef.current.open()
                    }
                    className="text-sm hover:bg-dark-blue bg-darkest-blue py-2 px-4 font-[400]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p>
                {sprint.status}: {sprint.name}
              </p>
            </h2>
            <div className="text-xs  flex flex-col gap-1 font-[400] text-slate-400">
              <p>Target: {sprint.target}</p>
              <div className="flex gap-2">
                <DateFormatted label="From: " dateObj={sprint.dateFrom ? new Date(sprint.dateFrom) : null} />
                <DateFormatted label="To: " dateObj={sprint.dateTo ? new Date(sprint.dateTo) : null} />
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-5">
            {sprint.status == "Planning" ? (
              <button onClick={handleChangeSprintStatus}>Start Sprint</button>
            ) : (
              <button onClick={() => endSprintRef.current?.open()}>
                End Sprint
              </button>
            )}

            <AddButton
              type="task"
              placeholder="Add task"
              sprintId={sprint.id}
            />
          </div>
        </header>
        {tasks && (
          <ul className="w-full flex flex-col gap-2">
            {tasks.length > 0 ? tasks.map((task) => {
              return <SortableTaskItem key={task.id} item={task} />;
            }) : <p className="px-5 py-2 font-[400] text-slate-600 font-sm">Drop tasks here</p>}
          </ul>
        )}
      </div>
    </>
  );
};

export default SprintList;
