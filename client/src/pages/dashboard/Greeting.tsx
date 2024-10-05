import React from "react";
import { useAuth } from "../../store/AuthContext";

const Greeting: React.FC = () => {
    const {user} = useAuth();

    let initials = user?.email;
    if(user?.name && user?.surname){
        initials = user.name
    }

    return (
        <div className="flex flex-col justify-center items-center p-5">
            <h2 className="text-5xl font-[800] text-slate-200">Hello <span className="text-light-orange">{initials}</span></h2>
        </div>
    )
}

export default Greeting;