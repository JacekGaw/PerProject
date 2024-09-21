import React, { useState, useEffect } from "react";
import { useProjectCtx, Project } from "../../store/ProjectsContext";
import ProjectListItem from "./ProjectListItem";
import { delay, motion } from "framer-motion";

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
          <li className="grid grid-cols-4 gap-4 justify-between items-center *:font-[200] text-sm border-b-2 border-slate-800 *:p-2">
            <h3 className="text-left ">Name:</h3>
            <p className="text-left ">Alias:</p>
            <p className="text-left font-semibold">Status:</p>
            <p className="text-left font-semibold">Created:</p>
          </li>

          {projects.map((project) => (
            <ProjectListItem
              key={project.alias}
              name={project.name}
              alias={project.alias}
              createdAt={project.createdAt}
              status={project.status}
            />
          ))}
        </motion.ul>
      )}
    </>
  );
};

export default ProjectsList;
