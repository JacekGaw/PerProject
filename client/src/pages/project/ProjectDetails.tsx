import React, { useState, useEffect, useRef } from "react";
import {
  Project,
  useProjectCtx,
  projectStatuses,
  ProjectStatus,
} from "../../store/ProjectsContext";
import { useUserCtx } from "../../store/UserContext";
import { useAuth } from "../../store/AuthContext";
import bookmark_checked from "../../assets/img/bookmark_checked.svg";
import bookmark_unchecked from "../../assets/img/bookmark_unchecked.svg";
import { motion, AnimatePresence } from "framer-motion";
import downArrowIcon from "../../assets/img/down_arrow.svg";
import DateFormatted from "../../components/UI/DateFormatted";
import UserAvatar from "../../components/UI/UserAvatar";
import { useCompanyCtx } from "../../store/CompanyContext";
import DescriptionComponent from "./DescriptionComponent";
import ChangeUser from "../../components/UI/ChangeUser";
import deleteIcon from "../../assets/img/delete.svg";
import { useNavigate } from "react-router-dom";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const { bookmarkProject, deleteProject, changeProject } = useProjectCtx();
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { companyUsers } = useCompanyCtx();
  const { bookmarks } = useUserCtx();
  const { user } = useAuth();
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const statusRef = useRef<HTMLSelectElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

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

  const handleDeleteProject = async () => {
    const deleteStatus = await deleteProject(project.id);
    if (deleteStatus.status == "Success") {
      navigate("/dashboard/projects", { replace: true });
    }
  };

  const handleChangeStatus = async () => {
    if (!statusRef.current) {
      return;
    }
    if (project.status !== statusRef.current.value) {
      await changeProject(project.id, {
        status: statusRef.current.value as ProjectStatus,
      });
    }
  };

  const handleDateChange = async (type: "startDate" | "endDate") => {
    if (!startDateRef.current && !endDateRef.current) {
      return;
    }
    await changeProject(project.id, {
      [type]:
        type == "startDate"
          ? startDateRef.current!.value
          : endDateRef.current!.value,
    });
  };

  return (
    <section className="flex flex-col gap-2 ">
      <header className="w-full  flex justify-between gap-2 items-center py-2">
        <h1 className="font-[200] text-slate-200 text-5xl">
          <span className="text-normal-orange font-[400]">{project.alias}</span>{" "}
          | {project.name}{" "}
        </h1>
        <div className="inline-flex">
          <select
            id="projectStatus"
            ref={statusRef}
            className="bg-black-blue hover:bg-darkest-blue cursor-pointer transition-all duration-200 text-xl text-right text-slate-200 p-2 font-[200] appearance-none"
            onChange={handleChangeStatus}
          >
            {projectStatuses.map((statusItem) => {
              return (
                <option
                  key={statusItem}
                  value={statusItem}
                  selected={statusItem == project.status}
                >
                  {statusItem}
                </option>
              );
            })}
          </select>
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
          <button onClick={handleDeleteProject}>
            <img src={deleteIcon} className="w-8 max-h-8 p-2" />
          </button>
        </div>
      </header>
      <AnimatePresence mode="wait">
        {detailsOpen && (
          <motion.div
            initial={{ height: 0, overflow: "visible" }}
            animate={
              detailsOpen
                ? { height: "auto", overflow: "hidden" }
                : { height: 0, overflow: "visible" }
            }
            exit={{ height: 0 }}
            className=" w-full flex flex-col gap-2"
          >
            <div className="w-full flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-5 gap-2 flex flex-col text-base text-justify text-slate-400 leading-6">
                <p className="font-[600] text-lg">Description: </p>
                <DescriptionComponent type="project" task={project} />
              </div>
              <div className="bg-[#050A16] flex flex-col gap-2 p-5 w-full md:w-1/2">
                <p className="font-[600] text-slate-400 text-lg">Info: </p>
                <div className="flex justify-between items-center gap-2">
                  <p>
                    <DateFormatted
                      dateObj={project.createdAt}
                      label="Created: "
                    />
                  </p>
                  <div className=" text-slate-400 font-[600]">
                    <label htmlFor="projectStartDate">Start Date: </label>
                    <input
                      ref={startDateRef}
                      onChange={() => handleDateChange("startDate")}
                      id="projectStartDate"
                      type="date"
                      defaultValue={project.startDate?.toString()}
                      className="bg-darkest-blue "
                    />
                  </div>
                  <div className=" text-slate-400 font-[600]">
                    <label htmlFor="projectEndDate">End Date: </label>
                    <input
                      ref={endDateRef}
                      onChange={() => handleDateChange("endDate")}
                      id="projectEndDate"
                      type="date"
                      defaultValue={project.endDate?.toString()}
                      className="bg-darkest-blue"
                    />
                  </div>
                </div>
                <div className="flex justify-around text-slate-400 items-center gap-2">
                  <p className="flex items-center gap-2">
                    Author of the project:{" "}
                    <UserAvatar
                      user={companyUsers.find(
                        (user) => user.id === project.authorId
                      )}
                      orientation="top"
                    />
                  </p>
                  <p className="flex items-center gap-2">
                    Project Manager:{" "}
                    {project.projectManagerId !== null ? (
                      <ChangeUser
                        type="project"
                        item={project}
                        orientation="left"
                      />
                    ) : (
                      "not set"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="flex items-center justify-center w-full">
        <span className="flex-grow  border-b  border-slate-600 mx-2"></span>
        <button
          onClick={() => setDetailsOpen((p) => !p)}
          className=" flex justify-center items-center gap-2 "
        >
          <motion.img
            initial={{ rotate: 0 }}
            animate={detailsOpen ? { rotate: 180 } : { rotate: 0 }}
            src={downArrowIcon}
            className="w-3"
          />
          <p className="text-slate-300 text-sm font-[300]">Details</p>
        </button>
        <span className="flex-grow border-b  border-slate-600 mx-2"></span>
      </p>
    </section>
  );
};

export default ProjectDetails;
