import React, {useRef} from 'react';
import { Task } from '../../store/TasksContext';
import errorIcon from "../../assets/img/errorIcon.svg";
import taskIcon from "../../assets/img/taskIcon.svg";
import storyIcon from "../../assets/img/storyIcon.svg";
import { Link } from 'react-router-dom';
import ChangeUser from '../../components/UI/ChangeUser';
import Priority from '../../components/UI/Priority';
import { useTasksCtx } from '../../store/TasksContext';

interface taskType {
    type: string,
    icon: string
}

interface TaskItemProps {
    item: Task
}

type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";


const taskStatuses = ["To Do", "In Progress", "On Hold", "Done"];
const taskTypes: taskType[] = [{type: "Task", icon: taskIcon}, {type: "Story", icon: storyIcon}, {type: "Error", icon: errorIcon}];
// const taskPriority = ["Low", "Medium", "High"];

const TaskItem: React.FC<TaskItemProps > = ({item}) => {
    const { changeTask } = useTasksCtx();

    const statusRef = useRef<HTMLSelectElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    
    const taskType: taskType = taskTypes.filter((typeFromArr) => item.type == typeFromArr.type)[0];

    const changeStatus: () => Promise<void> = async () => {
        if(!statusRef.current){
            return; 
        }
        const validStatuses: TaskStatus[] = ["To Do", "In Progress", "On Hold", "Done"];
        const newStatus = statusRef.current.value as TaskStatus;
        if (!validStatuses.includes(newStatus)) {
            console.error("Invalid status value");
            return;
          }
        try {
            const response = await changeTask("task", item.id, {status: newStatus});
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }   

    const openSelect = () => selectRef.current && selectRef.current.focus();

    return (    
        <>
            <li className='flex gap-2 w-full items-center justify-between p-1  bg-darkest-blue bg-opacity-50 rounded-sm'>
                <div onClick={openSelect} className={`w-24 relative  flex justify-left items-center gap-1 text-xs p-2`}>
                    <img src={taskType.icon} className='max-w-4 fill-slate-100' />
                    <p className='font-[200]'>{taskType.type}</p>
                </div>
                <Link to={`task/${item.id}`} className='text-left w-full font-[300] px-5 py-2'>{item.taskText}</Link>
                <select value={item.status}  onChange={changeStatus} ref={statusRef}   className='bg-darkest-blue text-sm p-2 rounded-sm'>
                    {taskStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <ChangeUser item={item} type='task' />
                <Priority  task={item} />
            </li>
        </>
    )
}

export default TaskItem;