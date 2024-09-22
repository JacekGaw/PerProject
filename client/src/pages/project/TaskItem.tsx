import React from 'react';
import { Task } from './ProjectRoot';
import { useCompanyCtx } from '../../store/CompanyContext';
import errorIcon from "../../assets/img/errorIcon.svg";
import taskIcon from "../../assets/img/taskIcon.svg";
import storyIcon from "../../assets/img/storyIcon.svg";

type taskType = {
    type: string,
    icon: string
}

interface TaskItemProps {
    item: Task
}

const taskStatuses = ["To Do", "In Progress", "On Hold", "Done"];
const taskTypes: taskType[] = [{type: "Task", icon: taskIcon}, {type: "Story", icon: storyIcon}, {type: "Error", icon: errorIcon}];
const taskPriority = ["Low", "Medium", "High"];

const TaskItem: React.FC<TaskItemProps> = ({item}) => {
    const {companyUsers} = useCompanyCtx();

    const assignedUser = companyUsers.filter(user => user.id == item.assignedTo)[0];
    let initials = "PP";
    if(assignedUser.name && assignedUser.surname){
        initials = `${assignedUser.name[0]}${assignedUser.surname[0]}`
    }
    const taskType: taskType = taskTypes.filter((typeFromArr) => item.type == typeFromArr.type)[0];
    return (    
        <>
            <li className='flex gap-2 w-full items-center justify-between p-1  bg-darkest-blue bg-opacity-50 rounded-sm'>
                <div className={` w-20 border border-slate-800 flex justify-left items-center gap-1 text-xs p-2`}>
                    <img src={taskType.icon} className='max-w-4 fill-slate-100' />
                    <p className='font-[200]'>{taskType.type}</p>
                </div>
                <p className='text-left w-full font-[300] px-5 py-2'>{item.taskText}</p>
                <select defaultValue={item.status}  className='bg-darkest-blue text-sm p-2 rounded-sm'>
                    {taskStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <div className='w-10 h-10 p-2 flex justify-center items-center bg-darkest-blue rounded-full'><p className='p-2'>{initials}</p></div>
                
            </li>
        </>
    )
}

export default TaskItem;