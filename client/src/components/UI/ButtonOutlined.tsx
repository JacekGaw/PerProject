import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children: React.ReactNode;
  }

const ButtonOutlined:React.FC<ButtonProps> = ({className, type, onClick, disabled, children}) => {
    return (
        <motion.button
        initial={{scale: 1, x:0}}
        whileHover={disabled ? {scale: 1, x:0} : {scale: 1.01, x:-2, y:-2}}
        
        type={type} onClick={onClick} disabled={disabled} className={`${className} relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 ${disabled ? "opacity-70" : "hover:-translate-x-0.5 hover:-translate-y-0.5" }`}>
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            {children}
            </span>
        </motion.button>
    )
}

export default ButtonOutlined;