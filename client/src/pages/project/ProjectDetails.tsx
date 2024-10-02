import React, { useState, useEffect } from "react";
import { Project, useProjectCtx } from "../../store/ProjectsContext";
import { useUserCtx } from "../../store/UserContext";
import { useAuth } from "../../store/AuthContext";
import bookmark_checked from "../../assets/img/bookmark_checked.svg";
import bookmark_unchecked from "../../assets/img/bookmark_unchecked.svg";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const { bookmarkProject } = useProjectCtx();
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { bookmarks } = useUserCtx();
  const { user } = useAuth();

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
    <>
      <header className="w-full border-b pb-5 flex justify-between gap-2 items-center">
        <h1 className="font-[800] text-slate-200 text-2xl">{project.name}</h1>
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
    </>
  );
};

export default ProjectDetails;
