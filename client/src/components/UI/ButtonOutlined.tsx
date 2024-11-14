import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children: React.ReactNode;
    name?: string;
    value?: string
  }

const ButtonOutlined:React.FC<ButtonProps> = ({className, type, onClick, disabled, children, name, value}) => {
    return (
        <motion.button
        initial={{scale: 1}}
        whileHover={disabled ? {scale: 1} : {scale: 1.05}}
        name={name} value={value}
        type={type} onClick={onClick} disabled={disabled} className={`${className} relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 ${disabled ? "opacity-70" : "hover:-translate-x-0.5 hover:-translate-y-0.5" }`}>
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            {children}
            </span>
        </motion.button>
    )
}

export default ButtonOutlined;