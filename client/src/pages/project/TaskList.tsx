import React from 'react';
import TaskItem from './TaskItem';
import { useProjectCtx } from '../../store/ProjectsContext';




const TaskList: React.FC = () => {
    const {tasks} = useProjectCtx();
    console.log(tasks);

    return (
        <>
        {tasks && 
            <ul className='w-full flex flex-col gap-2'>
                {tasks.map((task) => {
                    return (
                        <TaskItem key={task.id} item={task} />
                    )
                })}
            </ul>
        }
        </>
    )
}

export default TaskList;