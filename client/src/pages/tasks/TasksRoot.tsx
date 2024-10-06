import React, { useEffect, useState } from 'react';
import { useTasksCtx } from '../../store/TasksContext';

const TasksRoot: React.FC = () => {
    const {getUserTasks} = useTasksCtx();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadUserTasks = async() => {
            setLoading(true);
            try {
                const tasks = await getUserTasks();
                console.log(tasks);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
        loadUserTasks()
    }, [getUserTasks])

    return (
        <>
        <section className="w-full max-w-screen-xl mx-auto gap-10 flex flex-col">
      <header className="w-full border-b py-5 flex justify-between gap-2 items-center">
        <h1 className="font-[800] text-slate-200 text-2xl">Tasks</h1>
        
      </header>
      {loading ? <p>Loading...</p>: <p>tasks</p>}
        </section>
        </>
    )
}

export default TasksRoot;
  