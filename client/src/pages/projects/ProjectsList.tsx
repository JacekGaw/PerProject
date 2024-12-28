import React, { useState, useEffect } from "react";
import { useProjectCtx, Project } from "../../store/ProjectsContext";
import { useUserCtx } from "../../store/UserContext";
import ProjectListItem from "./ProjectListItem";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0 },
};

interface ProjectState {
  bookmarks: Project[];
  all: Project[];
}

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectState>({
    bookmarks: [],
    all: [],
  });
  const { getCompanyProjects } = useProjectCtx();
  const { getUserBookmarks } = useUserCtx();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const responseProjects = await getCompanyProjects();
        const bookmarks = await getUserBookmarks();
        if (bookmarks.data) {
          const bookmarkedProjects = responseProjects.filter((project) =>
            bookmarks.data!.some(
              (bookmark) => bookmark.projectId === project.id
            )
          );
          const nonBookmarkedProjects = responseProjects.filter(
            (project) =>
              !bookmarks.data!.some(
                (bookmark) => bookmark.projectId === project.id
              )
          );
          setProjects({
            bookmarks: bookmarkedProjects,
            all: nonBookmarkedProjects,
          });
        } else {
          setProjects({ bookmarks: [], all: responseProjects });
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
        <>
          <div className="flex flex-col w-full bg-dark-blue p-5 rounded-xl shadow-md shadow-slate-900">
            <h3 className="uppercase text-xl font-[400] mb-8 text-slate-200">
              Bookmarks
            </h3>
            <li className="w-full flex gap-2 justify-between items-center text-slate-500 text-sm font-[300]">
              <p className="w-16">Alias</p>
              <p className="flex-1">Project Name</p>
              <p className="w-32">Status</p>
              <p className="w-32">Date</p>
              <p className="w-10">PM</p>
            </li>
            <motion.ul
              key={projects.bookmarks.length}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {projects.bookmarks.map((project) => (
                <motion.li key={project.alias} variants={listItem}>
                  <ProjectListItem project={project} />
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="p-5 rounded-xl shadow-md shadow-slate-900">
            <h3 className="uppercase text-xl font-[400] mb-8 text-slate-200">
              All projects
            </h3>
            <li className="w-full flex gap-2 justify-between items-center text-slate-500 text-sm font-[300]">
              <p className="w-16">Alias</p>
              <p className="flex-1">Project Name</p>
              <p className="w-32">Status</p>
              <p className="w-32">Date</p>
              <p className="w-10">PM</p>
            </li>
            <motion.ul
              key={projects.all.length}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {projects.all.map((project) => (
                <motion.li key={project.alias} variants={listItem}>
                  <ProjectListItem project={project} />
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectsList;
