import React, { useRef } from "react";
import { motion } from "framer-motion";
import plusIcon from "../../assets/img/plus.svg";
import Modal, { ModalRef } from "../../components/UI/Modal";
import AddNewProjectForm from "./AddNewProjectForm";
import ProjectsList from "./ProjectsList";

const ProjectsRoot: React.FC = () => {
  const modalRef = useRef<ModalRef | null>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.open();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <>
      <Modal ref={modalRef} onClose={closeModal}>
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <header className="max-w-[400px] flex flex-col gap-2">
            <h1 className="text-center font-[500] text-xl">Add New Project</h1>
            <p className="text-sm font-[200] text-justify">
              Remember to input all the requested informations. Description
              should be short but consise! You can change all those informations
              later in 'project settings'.
            </p>
          </header>

          <AddNewProjectForm exit={closeModal} />
        </div>
      </Modal>
      <section className="w-full max-w-screen-xl mx-auto gap-10 flex flex-col">
        <header className="w-full border-b py-5 flex justify-between gap-2 items-center">
          <h1 className="font-[800] text-slate-200 text-2xl">Projects</h1>
          <motion.button
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={openModal}
            className="bg-gradient-to-r from-normal-orange to-vibrant-orange p-2 rounded-full w-8 h-8 flex justify-center items-center"
          >
            <img src={plusIcon} alt="Add New Project" className="w-4" />
          </motion.button>
        </header>
        <ProjectsList />
      </section>
    </>
  );
};

export default ProjectsRoot;
