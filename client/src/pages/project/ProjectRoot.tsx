import axios from "axios";
import React, { useEffect, useState } from "react";
import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { useProjectCtx, Task, Project } from "../../store/ProjectsContext";
import { SprintType, useSprintsCtx, SprintStatus } from "../../store/SprintsContext";
import TaskList from "./TaskList";
import ProjectDetails from "./ProjectDetails";
import { useTasksCtx } from "../../store/TasksContext";

type LoaderData = {
  project: Project;
  tasks: Task[];
  sprints: SprintType[]
};

const ProjectRoot: React.FC = () => {
  const { setProject } = useProjectCtx();
  const {setTasks} = useTasksCtx()
  const {setSprints} = useSprintsCtx();
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const { project, tasks, sprints } = useLoaderData() as LoaderData;
  useEffect(() => {
    setIsLoading(true);
    if (project) {
      setProject(project);
    }
    if (tasks) {
      setTasks(tasks);
    }
    if(sprints) {
      setSprints({active: sprints.filter((sprint) => sprint.status === "Active"), planning: sprints.filter((sprint) => sprint.status === "Planning")})
    }
    setIsLoading(false);
  }, [project, tasks, sprints, setProject, setTasks]);

  

  return (
    <>
      <section className="w-full max-w-screen-xl mx-auto gap-10 flex flex-col">
        <div>
          <Link
            to="/dashboard/projects"
            className="text-sm text-slate-500 hover:text-normal-blue"
          >
            &larr; Projects
          </Link>
          <ProjectDetails project={project} />
        </div>
        {isLoading ? <div>Loading tasks...</div> : <TaskList />}
      </section>
      <Outlet />
    </>
  );
};

export default ProjectRoot;

export const projectLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<{ project: Project; tasks: Task[], sprints: SprintType[] }> => {
  const alias = params.alias;

  if (!alias) {
    throw new Response("Missing project alias", { status: 400 });
  }
  try {
    const response = await axios.get(
      `http://localhost:3002/api/project/${alias}/tasks`
    );
    console.log("DATA FROM LOADER ", response.data.data);
    return {
      project: response.data.data.project,
      tasks: response.data.data.tasks,
      sprints: response.data.data.sprints
    };
  } catch (err) {
    throw new Response(`Project and tasks not found: ${err}`, { status: 404 });
  }
};
