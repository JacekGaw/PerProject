import React, {useState, useEffect} from "react";
import { useTasksCtx, DashboardTaskType } from "../../store/TasksContext";
import { Link } from "react-router-dom";


const UserTasks: React.FC = () => {
    const { getDashboardTasks } = useTasksCtx();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tasks, setTasks] = useState<DashboardTaskType[] | undefined>();

    useEffect(() => {
        const loadTasks = async () => {
            setIsLoading(true);
            const userTasks = await getDashboardTasks()
            userTasks ? setTasks(userTasks) : undefined
            setIsLoading(false)
        }
        loadTasks();
    }, [getDashboardTasks])
    
    return (
        <>
        <header className="bg-light-blue text-black px-5 py-2 text-lg font-[400] ">
            <h2>Related tasks:</h2>
        </header>
        {isLoading ? <p>Loading...</p> :
        <ul className="max-h-[400px] overflow-y-auto overflow-x-hidden">
            {tasks && tasks.map(task => {
                const date = new Date(task.createdAt);
                const formattedDate = date.toLocaleDateString();
                return <Link to={`/dashboard/projects/${task.projectAlias}/task/${task.id}`} className='flex z-10 gap-2 justify-between items-center border border-slate-800 rounded-sm *:px-2 *:py-4  bg-darkest-blue bg-opacity-40'>
                    <p className="text-left w-16 text-light-blue text-sm font-[700]">{task.projectAlias}</p>
            <h3 className="text-left font-[600] flex-1 truncate">{task.taskText}</h3>
            
            <p className="text-left w-32 text-slate-400 uppercase text-sm">{task.status}</p>
            <p className="text-left w-32 text-sm text-normal-blue text-[700]">{formattedDate}</p>
                </Link>
            })}
            </ul>}
        </>
    )
}

export default UserTasks;