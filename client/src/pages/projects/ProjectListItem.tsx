import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const listItem = {
    hidden: { opacity: 0, y: -50 },
    show: { opacity: 1, y: 0 }
  };

interface ProjectListItemProps {
    name: string;
    alias: string;
    createdAt: string;
    status: "Active" | "On Hold" | "Completed" | "Archive" | "Maintaining";
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ name, alias, createdAt, status }) => {
    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString();

    return (
        <motion.li key={alias} variants={listItem} whileHover={{scale: 1.01, y:-2}}>
            <Link to={`/dashboard/projects/${alias}`} className='grid grid-cols-4 gap-4 justify-between items-center border border-slate-800 rounded-sm *:px-2 *:py-4 *:font-[200] bg-darkest-blue bg-opacity-40'>
            <h3 className="text-left ">{name}</h3>
            <p className="text-left ">{alias}</p>
            <p className="text-left ">{status}</p>
            <p className="text-left">{formattedDate}</p>
            </Link>
        </motion.li>
    );
};

export default ProjectListItem;
