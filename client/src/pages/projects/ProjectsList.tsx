import React, { useState, useEffect } from "react";
import { useProjectCtx, Project } from "../../store/ProjectsContext";
import { useUserCtx } from "../../store/UserContext";
import ProjectListItem from "./ProjectListItem";
import {  motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

interface ProjectState {
  bookmarks: Project[],
  all: Project[]
}

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectState>({ bookmarks: [], all: [] });
  const { getCompanyProjects } = useProjectCtx();
  const {  getUserBookmarks } = useUserCtx();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const responseProjects = await getCompanyProjects();
        const bookmarks = await getUserBookmarks();
        if(bookmarks.data){
          const bookmarkedProjects = responseProjects.filter(project => 
            bookmarks.data!.some(bookmark => bookmark.projectId === project.id)
          );
          
          const nonBookmarkedProjects = responseProjects.filter(project => 
            !bookmarks.data!.some(bookmark => bookmark.projectId === project.id)
          );
          setProjects({"bookmarks": bookmarkedProjects, "all": nonBookmarkedProjects});

        }
        else {
          setProjects({"bookmarks": [], "all": responseProjects});
        }
        
        
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
          <p>Bookmarks: </p>
          {projects.bookmarks.map((project) => (
            <ProjectListItem
              key={project.alias}
              project={project}
            />
          ))}
          <p>Others: </p>
          {projects.all.map((project) => (
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
