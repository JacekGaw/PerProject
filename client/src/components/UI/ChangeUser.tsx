import React, { useState, useEffect, useRef } from "react";
import { useCompanyCtx, CompanyUserType } from "../../store/CompanyContext";
// import { Task } from "../../pages/project/ProjectRoot";
import UserAvatar from "./UserAvatar";
import { useTasksCtx ,SubTask, Task } from "../../store/TasksContext";

interface ChangeUserProps {
  item: Task | SubTask;
  type: "subtask" | "task" | "project";
}

const ChangeUser: React.FC<ChangeUserProps> = ({ item, type }) => {
  const [listOpen, setListOpen] = useState<boolean>(false);
  const { companyUsers } = useCompanyCtx();
  const {changeTask} = useTasksCtx()
  const ref = useRef<HTMLDivElement>(null); // Ref to track clicks outside

  const assignedUser: CompanyUserType | undefined = companyUsers.find((user) => user.id === item.assignedTo);

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
        // Add here option to change project PM
        
    } catch (error) {
        console.error("Error updating task:", error);
      } finally {
        setListOpen(false);
      }
  }

  return (
    <div className="relative" ref={ref}>
      <UserAvatar orientation={"left"} onClick={() => setListOpen((prev) => !prev)} user={assignedUser} />
      {listOpen && (
        <div className="border border-normal-blue absolute right-[100%] bottom-0  flex flex-col rounded-xl bg-darkest-blue">
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
