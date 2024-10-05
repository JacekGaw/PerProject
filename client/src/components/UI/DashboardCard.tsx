import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
    className?: string | null;
    children?: ReactNode
}

const DashboardCard: React.FC<DashboardCardProps> = ({className, children}) => {
    return (
        <motion.div
        className={`border-2 border-light-blue rounded-xl overflow-hidden drop-shadow-md ${className}`}>
            {children}
        </motion.div>
    )
}

export default DashboardCard;