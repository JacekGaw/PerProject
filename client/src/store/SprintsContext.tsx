import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Task } from "./ProjectsContext";
import axios from "axios";
import { useProjectCtx } from "./ProjectsContext";
import { useTasksCtx } from "./TasksContext";
import { useCompanyCtx } from "./CompanyContext";

export interface SprintType {
  id: number;
  name: string;
  target: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  status: "Active" | "Planning" | "Completed";
  created: string;
  projectId: number;
}

export interface NewSprintType {
  name: string;
  target: string;
  dateFrom: string | null;
  dateTo: string | null;
  tasks: { id: number }[];
}

interface NewSprintResponseDataType {
  sprint: SprintType;
  tasks?: Task[];
}

interface SprintsStateType {
  active: SprintType[] | null;
  planning: SprintType[] | null;
}

interface SprintsContextProps {
  sprints: SprintsStateType;
  setSprints: Dispatch<SetStateAction<SprintsStateType>>;
  addNewSprint: (
    data: NewSprintType
  ) => Promise<{ status: string; text: string }>;
  deleteSprint: (
    sprint: SprintType
  ) => Promise<{ status: string; text: string }>;
  changeSprint: (
    sprintId: number,
    sprintData: Partial<SprintType>
  ) => Promise<{ status: string; text: string }>;
  changeSprintStatus: (
    sprintId: number,
    sprintData: "Active" | "Planning"
  ) => Promise<{ status: string; text: string }>;
  endSprint: (sprintId: number, tasksAction: "backlog" | "done", retro: boolean) => Promise<{ status: string; text: string }>;
}

export const SprintsContext = createContext<SprintsContextProps | undefined>(
  undefined
);

export const useSprintsCtx = (): SprintsContextProps => {
  const context = useContext(SprintsContext);
  if (context === undefined) {
    throw new Error(
      "Sprint Context must be used within an SprintContextProvider"
    );
  }
  return context;
};

export const SprintsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sprints, setSprints] = useState<SprintsStateType>({
    active: null,
    planning: null,
  });
  const { project } = useProjectCtx();
  const { setTasks } = useTasksCtx();
  const { company } = useCompanyCtx();

  const addNewSprint = async (data: NewSprintType) => {
    try {
      const dataToSend = { ...data, projectId: project!.id };
      const response = await axios.post(
        "http://localhost:3002/api/sprint",
        dataToSend
      );
      if (response.status == 200 || response.status == 201) {
        const responseData: NewSprintResponseDataType = response.data.data;
        console.log("DATAAAAA",responseData);
        setSprints((prevData) => ({
          active: prevData.active,
          planning: [...(prevData.planning || []), responseData.sprint],
        }));
        if(responseData.tasks) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => {
              // Find if the current task is in the updated tasks array
              const updatedTask = responseData.tasks?.find(
                (t) => t.id === task.id
              );
              // Update only if task is in updatedTasks array, otherwise return the task as-is
              return updatedTask ? { ...task, ...updatedTask } : task;
            })
          );
        }
        
        console.log(response.data.data);
        return { status: "Success", text: "Sprint Created" };
      } else {
        throw new Error(response.statusText);
      }
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const deleteSprint = async (sprint: SprintType) => {
    try {
      const response = await axios.delete(
        `http://localhost:3002/api/sprint/${sprint.id}`
      );
      if (response.status == 200 || response.status == 201) {
        if (sprint.status == "Active") {
          setSprints((prevData) => ({
            active: prevData.active!.filter((item) => item.id !== sprint.id),
            planning: prevData.planning,
          }));
        } else if (sprint.status == "Planning") {
          setSprints((prevData) => ({
            active: prevData.active,
            planning: prevData.planning!.filter(
              (item) => item.id !== sprint.id
            ),
          }));
        }
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.sprintId === sprint.id) {
              return { ...task, sprintId: null };
            }
            return task;
          })
        );
        console.log(response.data.data);
        return { status: "Success", text: "Sprint deleted" };
      } else {
        throw new Error(response.statusText);
      }
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const changeSprint = async (
    sprintId: number,
    sprintData: Partial<SprintType>
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3002/api/sprint/${sprintId}`,
        sprintData
      );
      if (response.status == 200 || response.status == 201) {
        const updatedSprint: SprintType = response.data.data;
        if (updatedSprint.status == "Active") {
          setSprints((prevData) => ({
            active: prevData.active!.map((item) =>
              item.id === updatedSprint.id ? updatedSprint : item
            ),
            planning: prevData.planning,
          }));
        } else if (updatedSprint.status == "Planning") {
          setSprints((prevData) => ({
            active: prevData.active,
            planning: prevData.planning!.map((item) =>
              item.id === updatedSprint.id ? updatedSprint : item
            ),
          }));
        }

        return { status: "Success", text: "Sprint updated" };
      }
      return { status: "Success", text: "Sprint updated" };
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const changeSprintStatus = async (
    sprintId: number,
    newStatus: "Active" | "Planning"
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3002/api/sprint/${sprintId}`,
        { status: newStatus }
      );
      if (response.status == 200 || response.status == 201) {
        const updatedSprint: SprintType = response.data.data;
        if (updatedSprint.status == "Active") {
          setSprints((prevData) => ({
            active: [...prevData.active!, updatedSprint],
            planning: prevData.planning!.filter(
              (item) => item.id !== updatedSprint.id
            ),
          }));
        } else if (updatedSprint.status == "Planning") {
          setSprints((prevData) => ({
            active: prevData.active!.filter(
              (item) => item.id !== updatedSprint.id
            ),
            planning: [...prevData.planning!, updatedSprint],
          }));
        }

        return { status: "Success", text: "Sprint updated" };
      }
      return { status: "Success", text: "Sprint updated" };
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const endSprint = async (
    sprintId: number,
    tasksAction: "done" | "backlog",
    retro: boolean
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3002/api/sprint/${sprintId}/end?tasksAction=${tasksAction}&retro=${retro}&company=${
          company!.id
        }&project=${project!.id}`
      );
      if (response.status == 200 || response.status == 201) {
        const responseData: {sprint: SprintType, retro: string | null} = response.data.data;
        
        return { status: "Success", text: responseData.retro };
      }
      return { status: "Success", text: "Sprint updated" };
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const ctxValue = {
    sprints,
    setSprints,
    addNewSprint,
    deleteSprint,
    changeSprint,
    changeSprintStatus,
    endSprint
  };

  return (
    <SprintsContext.Provider value={ctxValue}>
      {children}
    </SprintsContext.Provider>
  );
};
