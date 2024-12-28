import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserAvatar from '../../components/UI/UserAvatar';
import { useCompanyCtx } from '../../store/CompanyContext';
import { Project } from '../../store/ProjectsContext';



interface ProjectListItemProps {
    project: Project,
    sourceComponent?: "dashboard" | "projects"
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ sourceComponent, project }) => {
    const date = new Date(project.createdAt);
    const formattedDate = date.toLocaleDateString();
    const { companyUsers} = useCompanyCtx();

    return (
        <motion.div key={project.alias}  whileHover={{scale: 1.01, y:-2}} className="z-10">
            <Link to={`/dashboard/projects/${project.alias}`} className='flex z-10 gap-2 justify-between items-center  *:py-4'>
            <p className="text-left w-16 text-light-blue font-[200]">{project.alias}</p>
            <h3 className="text-left font-[200] flex-1 truncate">{project.name}</h3>
            
            <p className={`text-left w-32 font-[200] uppercase ${project.status == "Active" ? "text-normal-orange" : "text-slate-400"}`}>{project.status}</p>
            <p className="text-left w-32  text-light-blue font-[200]">{formattedDate}</p>
            {sourceComponent !== "dashboard" &&
            <UserAvatar details={false} user={companyUsers.filter(user => user.id == project.projectManagerId)[0]} />}
            </Link>
        </motion.div>
    );
};

export default ProjectListItem;
