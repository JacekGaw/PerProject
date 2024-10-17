import React, {useState, useEffect} from "react";
import { useProjectCtx, Project } from "../../store/ProjectsContext";
import ProjectListItem from "../projects/ProjectListItem";

const UserProjects: React.FC = () => {
    const {getDashboardProjects}= useProjectCtx();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [projects, setProjects] = useState<Project[] | undefined>();

    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            const companyProjects = await getDashboardProjects()
            companyProjects ? setProjects(companyProjects) : undefined
            setIsLoading(false)
        }
        loadProjects();
    }, [getDashboardProjects])
    
    return (
        <>
        <header className="  p-4 uppercase text-lg font-[400] ">
            <h2>Related projects:</h2>
        </header>
        {isLoading ? <p>Loading...</p> :
        <ul className="max-h-[400px] overflow-y-auto overflow-x-hidden">
            {projects && projects.map(project => {
                return <li key={project.id}><ProjectListItem sourceComponent="dashboard"  project={project} /></li>
            })}
            </ul>}
        </>
    )
}

export default UserProjects;