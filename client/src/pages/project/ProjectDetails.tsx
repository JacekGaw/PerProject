import React, { useState, useEffect } from "react";
import { Project, useProjectCtx } from "../../store/ProjectsContext";
import { useUserCtx } from "../../store/UserContext";
import { useAuth } from "../../store/AuthContext";
import bookmark_checked from "../../assets/img/bookmark_checked.svg";
import bookmark_unchecked from "../../assets/img/bookmark_unchecked.svg";
import { motion, AnimatePresence } from "framer-motion";
import downArrowIcon from '../../assets/img/down_arrow.svg'
import DateFormatted from "../../components/UI/DateFormatted";
import UserAvatar from "../../components/UI/UserAvatar";
import { useCompanyCtx } from "../../store/CompanyContext";
import DescriptionComponent from "./DescriptionComponent";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const { bookmarkProject } = useProjectCtx();
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const {companyUsers} = useCompanyCtx();
  const { bookmarks } = useUserCtx();
  const { user } = useAuth();
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsBookmarkLoading(true);
    if (bookmarks) {
      const isBookmarked = bookmarks.some(
        (bookmark) => bookmark.projectId === project.id
      );
      setIsBookmark(isBookmarked);
    }
    setIsBookmarkLoading(false);
  }, [bookmarks, project]);

  const changeBookmark = async (method: "delete" | "add") => {
    if (user) {
      setIsBookmarkLoading(true);
      const response = await bookmarkProject(method, project.id, user.id);
      console.log(response);
      response.status === "Success" && setIsBookmark(method === "add");
      setIsBookmarkLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-2 ">
      <header className="w-full  flex justify-between gap-2 items-center py-2">
        <h1 className="font-[400] text-slate-200 text-5xl">{project.name}</h1>
        {isBookmarkLoading ? (
          <button disabled>
            <img
              src={bookmark_unchecked}
              className="w-8 max-h-8 p-2 opacity-50"
            />
          </button>
        ) : isBookmark ? (
          <button onClick={() => changeBookmark("delete")}>
            <img src={bookmark_checked} className="w-8 max-h-8 p-2" />
          </button>
        ) : (
          <button onClick={() => changeBookmark("add")}>
            <img src={bookmark_unchecked} className="w-8 max-h-8 p-2" />
          </button>
        )}
      </header>
      <AnimatePresence mode="wait">
        {detailsOpen && 
          <motion.div
          initial={{height: 0, overflow: "visible"}}
          animate={detailsOpen ? {height: "auto", overflow: "hidden"} : {height: 0, overflow: "visible"}}
          exit={{height: 0}}
          className=" w-full flex flex-col gap-2"
          >
            <div className="w-full flex">   
              <div className="w-1/2 p-5 text-base text-justify text-slate-400 leading-6">
                <p className="font-[600] p-1 border-b border-slate-600 mb-2">Description: </p>
                <DescriptionComponent type="project" task={project}  />
              </div>
              <div className="bg-[#03040f] flex flex-col gap-2 p-5 w-1/2">
              <p className="font-[600] text-slate-400 p-1 border-b border-slate-600 mb-2">Info: </p>
              <div className="flex justify-between items-center gap-2">
              <p><DateFormatted dateObj={project.createdAt} label="Created: "  /></p>
              <p><DateFormatted dateObj={project.startDate} label="Stard Date: "  /></p>
              <p><DateFormatted dateObj={project.endDate} label="End Date: "  /></p>
              </div>
              <div className="flex justify-between items-center gap-2">
                <p className="flex items-center gap-2">Author of the project: <UserAvatar user={companyUsers.find(user => user.id === project.authorId)} orientation="top" /></p>
                <p className="flex items-center gap-2">Project Manager: {project.projectManagerId !== null ? <UserAvatar user={companyUsers.find(user => user.id === project.projectManagerId)} orientation="top" /> : "not set"}</p>
              </div>
              <p>Alias: {project.alias}</p>
              <p>Status: {project.status}</p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
      
      <p className="flex items-center justify-center w-full">
        <span className="flex-grow  border-b  border-slate-600 mx-2"></span>
        <button
              onClick={() => setDetailsOpen((p) => !p)}
              className=" flex justify-center items-center gap-2 "
            >
                <motion.img
                initial={{rotate: 0}}
                animate={detailsOpen ? {rotate: 180}: {rotate: 0}}
                src={downArrowIcon} className="w-3" />
              <p className="text-slate-300 text-sm font-[300]">Details</p>
            </button>
          <span className="flex-grow border-b  border-slate-600 mx-2"></span>
        </p>
      
    </section>
  );
};

export default ProjectDetails;
