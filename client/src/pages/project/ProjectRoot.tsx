import React, { useEffect, useState } from "react";
import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { useProjectCtx, Task, Project } from "../../store/ProjectsContext";
import { SprintType, useSprintsCtx } from "../../store/SprintsContext";
import SprintView from "./SprintView";
import ProjectDetails from "./ProjectDetails";
import { useTasksCtx } from "../../store/TasksContext";
import AllTasksList from "./AllTasksList";
import KanbanView from "./KanbanView";
import api from "../../api/api";

type LoaderData = {
  project: Project;
  tasks: Task[];
  sprints: SprintType[];
};

const sections = [
  {
    name: "Sprints View",
    component: <SprintView />,
  },
  {
    name: "Kanban Table",
    component: <KanbanView />,
  },
  {
    name: "All Tasks",
    component: <AllTasksList />,
  },
];

const ProjectRoot: React.FC = () => {
  const { setProject } = useProjectCtx();
  const { setTasks } = useTasksCtx();
  const { setSprints } = useSprintsCtx();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<number>(0);

  const { project, tasks, sprints } = useLoaderData() as LoaderData;
  useEffect(() => {
    setIsLoading(true);
    if (project) {
      setProject(project);
    }
    if (tasks) {
      setTasks(tasks);
    }
    if (sprints) {
      setSprints({
        active: sprints.filter((sprint) => sprint.status === "Active"),
        planning: sprints.filter((sprint) => sprint.status === "Planning"),
      });
    }
    setIsLoading(false);
  }, [project, tasks, sprints, setProject, setTasks]);

  return (
    <>
      <section className="w-full max-w-screen-2xl  gap-10 flex flex-col">
        <div>
          <Link
            to="/dashboard/projects"
            className="text-sm text-slate-500 hover:text-normal-blue"
          >
            &larr; Projects
          </Link>
          <ProjectDetails project={project} />
        </div>
        <div className="flex flex-col gap-0">
          <div className="w-full flex justify-left ml-[10%] gap-5 items-center ">
            {sections.map((item, index) => {
              return (
                <button
                  className={`py-2 px-5 lg:px-20 font-[200] text-slate-200 text-lg rounded-t-lg ${
                    currentView === index && "bg-dark-blue"
                  }`}
                  key={item.name}
                  onClick={() => setCurrentView(index)}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
          <div className=" border-4  rounded-xl border-dark-blue">
            {isLoading ? (
              <div>Loading tasks...</div>
            ) : (
              sections[currentView].component
            )}
          </div>
        </div>
      </section>
      <Outlet />
    </>
  );
};

export default ProjectRoot;

export const projectLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<{
  project: Project;
  tasks: Task[];
  sprints: SprintType[];
}> => {
  const alias = params.alias;

  if (!alias) {
    throw new Response("Missing project alias", { status: 400 });
  }
  try {
    const response = await api.get(
      `/api/project/${alias}/tasks`
    );
    return {
      project: response.data.data.project,
      tasks: response.data.data.tasks,
      sprints: response.data.data.sprints,
    };
  } catch (err) {
    throw new Response(`Project and tasks not found: ${err}`, { status: 404 });
  }
};
