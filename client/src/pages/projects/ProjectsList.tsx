import React, { useState, useEffect } from "react";
import { useProjectCtx, Project } from "../../store/ProjectsContext";
import ProjectListItem from "./ProjectListItem";
import {  motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>();
  const { getCompanyProjects } = useProjectCtx();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await getCompanyProjects();
        console.log(response);
        setProjects(response);
      } catch (err) {
        return <h3>Error</h3>;
      }
    };

    getProjects();
  }, []);

  return (
    <>
      {projects && (
        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2 w-full"
        >
          <li className="flex gap-2 justify-between items-center text-sm border-b-2 border-slate-800 *:p-2">
          <p className="text-left w-24">Alias:</p>
            <p className="text-left flex-1  ">Name:</p>
            
            <p className="text-left w-32 font-semibold">Status:</p>
            <p className="text-left font-semibold w-32">Created:</p>
            <p className="text-left font-semibold w-14">PM:</p>
          </li>

          {projects.map((project) => (
            <ProjectListItem
              key={project.alias}
              project={project}
            />
          ))}
        </motion.ul>
      )}
    </>
  );
};

export default ProjectsList;
