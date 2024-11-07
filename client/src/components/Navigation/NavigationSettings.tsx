import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { motion } from "framer-motion";
import settingsImg from "../../assets/img/settings.svg";
import logoutImg from "../../assets/img/logout.svg";

interface NavigationSettingsProps {
    initials: string
}


const childrenVariants = {
    initial: { height: 0, opacity: 0, paddingBottom: 0},
    hover: { height: "auto", opacity: 1, paddingBottom: 10}}

const NavigationSettings: React.FC<NavigationSettingsProps> = ({initials}: NavigationSettingsProps) => {
    const { logOut } = useAuth();

    return (
        <>
        <motion.div
        
        initial="initial" whileHover="hover" animate="initial"
        className="m-2 p-2 border-2 border-white flex flex-col rounded-full">
            
            <motion.div
            variants={childrenVariants}
            className="flex flex-col gap-2">
                <Link to="/dashboard/user"><img src={settingsImg} className="w-6 invert" /></Link>
                <button onClick={logOut}><img src={logoutImg} className="w-6 invert" /></button>
                
            </motion.div>
            <p>{initials}</p>
        </motion.div> 
        </>
    )
}

export default NavigationSettings;