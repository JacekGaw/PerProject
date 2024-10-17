import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
    className?: string | null;
    children?: ReactNode
}

const DashboardCard: React.FC<DashboardCardProps> = ({className, children}) => {
    return (
        <motion.div
        className={`bg-darkest-blue shadow-sm rounded-xl overflow-hidden drop-shadow-md ${className}`}>
            {children}
        </motion.div>
    )
}

export default DashboardCard;