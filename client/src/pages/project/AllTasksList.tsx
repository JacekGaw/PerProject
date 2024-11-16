import React from 'react'
import { useTasksCtx } from '../../store/TasksContext';
import TaskItem from './TaskItem';
import AddButton from '../../components/UI/AddButton';

const AllTasksList: React.FC = () => {
    const { tasks } = useTasksCtx();

    return (
        <>
            <div>
        <header className=" p-2 flex justify-between items-center gap-2">
            <div className="flex justify-center items-center gap-2">
          <h2 className="font-[300] text-light-blue text-xl">Backlog:</h2>
          </div>
          <div className="relative flex items-center gap-5">

            <AddButton type="task" placeholder="Add task" />
          </div>
        </header>
        {tasks && (
          <ul className="w-full flex flex-col gap-2">
            {tasks.map((task) => {
              return <TaskItem key={task.id} item={task} />;
            })}
          </ul>
        )}
      </div>
        </>
    )

}

export default AllTasksList;