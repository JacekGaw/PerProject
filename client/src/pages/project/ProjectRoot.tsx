import axios from "axios";
import React, {useEffect, useState} from "react";
import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { useProjectCtx } from "../../store/ProjectsContext";
import TaskList from "./TaskList";

type ProjectStatus =
  | "Active"
  | "On Hold"
  | "Completed"
  | "Archive"
  | "Maintaining";
type TaskStatus = "To Do" | "In Progress" | "On Hold" | "Done";
type TaskPriority = "Low" | "Medium" | "High";
type TaskType = "Task" | "Story" | "Error";

interface Project {
  id: number;
  name: string;
  alias: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  authorId: number | null;
  projectManagerId: number | null;
  companyId: number;
}

export interface Task {
  id: number;
  taskText: string;
  description: string | null;
  type: TaskType;
  createdAt: Date;
  updatedAt: Date | null;
  priority: TaskPriority;
  estimatedTime: number | null;
  status: TaskStatus;
  assignedTo: number | null;
  projectId: number;
  authorId: number;
}

type LoaderData = {
    project: Project,
    tasks: Task[]
}

const ProjectRoot: React.FC = () => {
    const {setProject, setTasks} = useProjectCtx();
    const [isLoading, setIsLoading] = useState<boolean>(true);

  const {project, tasks} = useLoaderData() as LoaderData;
  useEffect(() => {
    setIsLoading(true);
    if (project) {
        setProject(project);
    }
    if (tasks) {
        setTasks(tasks);
    }
    setIsLoading(false);
}, [project, tasks, setProject, setTasks]);
  
  return (
    <>
            <section className="w-full max-w-screen-xl mx-auto gap-10 flex flex-col">
                <div>
                    <Link to="/dashboard/projects" className="text-sm text-slate-500 hover:text-normal-blue">&larr; Projects</Link>
                    <header className="w-full border-b pb-5 flex justify-between gap-2 items-center">
                        <h1 className="font-[800] text-slate-200 text-2xl">{project.name}</h1>
                        
                    </header>
                </div>
                {isLoading ? (
                    <div>Loading tasks...</div>
                ) : (
                    <TaskList />
                )}
                
            </section>
            <Outlet />
        </>
  );
};

export default ProjectRoot;

export const projectLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<{ project: Project; tasks: Task[] }> => {
  const alias = params.alias;

  if (!alias) {
    throw new Response("Missing project alias", { status: 400 });
  }
  try {
    const response = await axios.get(
      `http://localhost:3002/api/project/${alias}/tasks`
    );
    return {
      project: response.data.data.project,
      tasks: response.data.data.tasks,
    };
  } catch (err) {
    throw new Response(`Project and tasks not found: ${err}`, { status: 404 });
  }
};
