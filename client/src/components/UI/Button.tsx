import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
    className?: string; // optional prop
    type?: "button" | "submit" | "reset"; // specific values allowed for the type prop
    onClick?: React.MouseEventHandler<HTMLButtonElement>; // function type for onClick event
    disabled?: boolean; // boolean type for disabled prop
    children: React.ReactNode; // children prop to allow nested content
  }

const Button:React.FC<ButtonProps> = ({className, type, onClick, disabled, children}) => {
    return (
        <motion.button
        initial={{scale: 1, x:0}}
        whileHover={disabled ? {scale: 1, x:0} : {scale: 1.01, x:-2, y:-2}}
        
        type={type} onClick={onClick} disabled={disabled} className={`${className} px-5 py-2 text-white flex justify-center items-center font-[600] bg-gradient-to-r from-[#e0942e] to-[#fc4545] rounded-lg ${disabled ? "opacity-70" : "hover:-translate-x-0.5 hover:-translate-y-0.5" }`}>
            {children}
        </motion.button>
    )
}

export default Button;