import React, { useState } from "react";
import { CompanyUserType } from "../../store/CompanyContext";
import { motion, AnimatePresence } from "framer-motion";

interface UserAvatarProps {
  onClick?: () => void;
  user: CompanyUserType | undefined;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ onClick, user }) => {
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const getInitials = (user: CompanyUserType) => {
    if (user.name && user.surname) return `${user.name[0]}${user.surname[0]}`;
    return "PP";
  };

  const formatDate = (date: string | undefined) => {
    if(date){
        const newDate = new Date(date)
        return newDate.toLocaleDateString()
    }
    return "";
  }
  return (
    <>
      <div
      onMouseEnter={() => setTimeout(() => setDetailsOpen((p) => !p), 500)}
      onMouseLeave={() => setTimeout(() => setDetailsOpen((p) => !p), 500)}
      className="relative">
      <AnimatePresence>
        {detailsOpen && (
            
          <motion.div
          initial={{opacity: 0, x:-20}}
          animate={detailsOpen ? {opacity: 1, x:0} : {opacity: 0, x:-20}}
          exit={{opacity: 0, x:-20}}
          className="absolute text-sm font-[200] top-0 z-50 left-[100%] p-2 border rounded-xl bg-darkest-blue flex flex-col gap-2">
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>Joined: {formatDate(user?.joinDate)}</p>
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
