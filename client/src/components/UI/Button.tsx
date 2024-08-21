import React from "react";

interface ButtonProps {
    className?: string; // optional prop
    type?: "button" | "submit" | "reset"; // specific values allowed for the type prop
    onClick?: React.MouseEventHandler<HTMLButtonElement>; // function type for onClick event
    disabled?: boolean; // boolean type for disabled prop
    children: React.ReactNode; // children prop to allow nested content
  }

const Button:React.FC<ButtonProps> = ({className, type, onClick, disabled, children}) => {
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${className} px-5 py-2 flex justify-center items-center font-[600] bg-gradient-to-r from-[#e0942e] to-[#fc4545] rounded-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 `}>
            {children}
        </button>
    )
}

export default Button;