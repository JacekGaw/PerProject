import React, { useState } from "react";
import { CompanyUserType } from "../../store/CompanyContext";
import { motion, AnimatePresence } from "framer-motion";


interface UserAvatarProps {
  onClick?: () => void;
  user: CompanyUserType | undefined;
  orientation?: "left" | "right" | "top" | "bottom";
   details?: boolean;
 }

const UserAvatar: React.FC<UserAvatarProps> = ({ onClick, user, orientation = "left", details = true  }) => {
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const getInitials = (user: CompanyUserType) => {
    if (user.name && user.surname) return `${user.name[0]}${user.surname[0]}`;
    return "PP";
  };

  const formatDate = (date: Date | undefined) => {
    if(date){
        const newDate = new Date(date)
        return newDate.toLocaleDateString()
    }
    return "";
  }
  return (
    <>
      <div
      
      // onMouseEnter={() => setTimeout(() => setDetailsOpen((p) => !p), 500)}
      // onMouseLeave={() => setTimeout(() => setDetailsOpen((p) => !p), 500)}
      onMouseEnter={() => setDetailsOpen(p => !p)}
      onMouseLeave={() => setDetailsOpen(p => !p)}

      className="relative z-auto">
      <AnimatePresence>
        {details && detailsOpen && (
          <motion.div
          initial={{opacity: 0}}
          animate={detailsOpen ? {opacity: 1} : {opacity: 0}}
          exit={{opacity: 0}}
          className={`absolute z-auto text-sm font-[200]  p-2 border rounded-xl bg-darkest-blue flex flex-col gap-2 ${orientation == "left" && "top-0 right-[100%]"} ${orientation == "right" && "top-0 left-[100%] "} ${orientation == "top" && "bottom-[100%]  left-[50%] -translate-x-[50%] "} ${orientation == "bottom" && "top-[100%]  left-[50%] -translate-x-[50%] "}`}>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>Joined: {formatDate(user!.joinDate)}</p>
            </motion.div>
            
        )}
        </AnimatePresence>
        <div
          onClick={onClick}
          className="w-10 h-10 p-2 flex justify-center items-center bg-darkest-blue rounded-full cursor-pointer"
        >
          <p className="p-2">{user ? getInitials(user) : "PP"}</p>
        </div>
      </div>
    </>
  );
};

export default UserAvatar;
