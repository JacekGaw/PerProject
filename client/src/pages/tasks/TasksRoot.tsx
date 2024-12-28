import React, { useEffect, useState } from "react";
import { useTasksCtx } from "../../store/TasksContext";
import Spinner from "../../components/UI/Spinner";
import TasksList from "./TasksList";

const TasksRoot: React.FC = () => {
  const { getUserTasks } = useTasksCtx();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadUserTasks = async () => {
      setLoading(true);
      try {
        await getUserTasks();
      } catch (err) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    loadUserTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="w-full max-w-screen-xl mx-auto gap-10 flex flex-col">
        <header className="w-full border-b py-5 flex justify-between gap-2 items-center">
          <h1 className="font-[800] text-slate-200 text-2xl">Tasks</h1>
        </header>
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Spinner />
            </div>
          ) : (
            <TasksList />
          )}
        </div>
      </section>
    </>
  );
};

export default TasksRoot;
