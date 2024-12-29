import React, { useState, useEffect, useRef } from "react";
import { useCompanyCtx, CompanyUserType } from "../../store/CompanyContext";
// import { Task } from "../../pages/project/ProjectRoot";
import UserAvatar from "./UserAvatar";
import { useTasksCtx , SubTask, Task } from "../../store/TasksContext";
import { useProjectCtx, Project } from "../../store/ProjectsContext";

interface ChangeUserProps {
  item: Task | SubTask | Project;
  type: "subtask" | "task" | "project";
  orientation?: "left" | "right" | "top" | "bottom";
}

const ChangeUser: React.FC<ChangeUserProps> = ({ item, type ,orientation }) => {
  const [listOpen, setListOpen] = useState<boolean>(false);
  const { companyUsers } = useCompanyCtx();
  const {changeTask} = useTasksCtx()
  const ref = useRef<HTMLDivElement>(null);
  const { changeProject} = useProjectCtx()

  const assignedUser: CompanyUserType | undefined = companyUsers.find((user) => {
    if (type === "project") {
      return user.id === (item as Project).projectManagerId;
    } else if (type === "task" || type === "subtask") {
      return user.id === (item as Task | SubTask).assignedTo;
    }
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setListOpen(false); // Close list if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeAssignedUser = async (userId: number) => {
    try {
        if(type !== "project") {
          await changeTask(type, item!.id!, {assignedTo: userId});
        }
        else {
          await changeProject(item.id!, {projectManagerId: userId});
        }
    } catch (error) {
        console.error("Error updating task:", error);
      } finally {
        setListOpen(false);
      }
  }

  return (
    <div className="relative" ref={ref}>
      <div className={`${listOpen && "border-slate-200 rounded-full"} border border-darkest-blue`}>
      <UserAvatar orientation={orientation} onClick={() => setListOpen((prev) => !prev)} user={assignedUser} />
      </div>
      {listOpen && (
        <div className="border border-normal-blue absolute right-[110%] bottom-0  flex flex-col rounded-xl bg-darkest-blue">
        <h4 className="text-sm text-center p-2 border-b border-slate-600">Company Users:</h4>
        <ul className=" max-h-64 overflow-y-auto ">
          {companyUsers.map((user) => (
            <li onClick={() => handleChangeAssignedUser(user.id)} key={user.id} className="cursor-pointer p-2 gap-2 flex items-center">
              <UserAvatar user={user} details={false}  />
              <div className="flex flex-col gap-1">
              <p className="text-sm font-[300]">{user.email}</p>
              <p className="text-xs font-[600] text-slate-600">{user.role}</p>
              </div>
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
};

export default ChangeUser;
