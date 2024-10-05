import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserAvatar from '../../components/UI/UserAvatar';
import { useCompanyCtx } from '../../store/CompanyContext';
import { Project } from '../../store/ProjectsContext';

const listItem = {
    hidden: { opacity: 0, y: -50 },
    show: { opacity: 1, y: 0 }
  };

interface ProjectListItemProps {
    project: Project,
    sourceComponent?: "dashboard" | "projects"
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ sourceComponent, project }) => {
    const date = new Date(project.createdAt);
    const formattedDate = date.toLocaleDateString();
    const { companyUsers} = useCompanyCtx();

    return (
        <motion.li key={project.alias} variants={listItem} whileHover={{scale: 1.01, y:-2}} className="z-10">
            <Link to={`/dashboard/projects/${project.alias}`} className='flex z-10 gap-2 justify-between items-center border border-slate-800 rounded-sm *:px-2 *:py-4  bg-darkest-blue bg-opacity-40'>
            <p className="text-left w-16 text-light-blue text-sm font-[700]">{project.alias}</p>
            <h3 className="text-left font-[600] flex-1 truncate">{project.name}</h3>
            
            <p className="text-left w-32 text-slate-400 uppercase text-sm">{project.status}</p>
            <p className="text-left w-32 text-sm text-normal-blue text-[700]">{formattedDate}</p>
            {sourceComponent !== "dashboard" &&
            <UserAvatar details={false} user={companyUsers.filter(user => user.id == project.projectManagerId)[0]} />}
            </Link>
        </motion.li>
    );
};

export default ProjectListItem;
