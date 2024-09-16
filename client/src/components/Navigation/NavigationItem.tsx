import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

interface NavigationItemProps {
  image: string;
  link: string;
  title: string;
  selected: boolean;
  onClick: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  image,
  link,
  title,
  selected,
  onClick,
}: NavigationItemProps) => {
  return (
    <motion.li
    initial={{opacity: 0.5, background: "#0C1A2E"}}
    animate={selected ? {opacity: 1, background: "#070F1B"} : {opacity: 0.5}}
    whileHover={{opacity: 1, background: "#070F1B"}}
    onClick={onClick} className="relative">
      <NavLink to={link} className="flex p-5 justify-between items-center z-20">
        <img
        src={image} className="w-6 max-h-6 invert" alt={title} />
      </NavLink>
      {selected && (
        <motion.div
          layoutId="border"
          className="absolute top-0 right-0 w-1 h-full bg-white"
        ></motion.div>
      )}
    </motion.li>
  );
};

export default NavigationItem;
