import React from "react";

interface PriorityProps {
    priority: "Low" | "Medium" | "High"
}

const Priority: React.FC<PriorityProps> = ({priority}) => {
    return (
        <>
            <div className="p-1 flex flex-col gap-1 justify-center items-center">
                <p className={`w-[7px] h-[7px] rounded-full ${priority === "High" ? "bg-normal-orange" : "bg-slate-800"}`}></p>
                <p className={`w-[7px] h-[7px] rounded-full bg-slate-800  ${priority === "Medium" && "bg-normal-blue"} ${priority === "High" && "bg-normal-orange"}`}></p>
                <p className={`w-[7px] h-[7px] rounded-full bg-light-blue ${priority === "High" && "bg-normal-orange"} ${priority === "Medium" && "bg-normal-blue"}`}></p>
            </div>
        </>
    )
}

export default Priority;