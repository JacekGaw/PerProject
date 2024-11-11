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




export interface SprintType {
  id: number;
  name: string;
  target: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  status: "Active" |  "Planning" | "Completed";
  created: string;
  projectId: number;
}

export interface NewSprintType {
  name: string;
  target: string;
  dateFrom: string | null;
  dateTo: string | null;
  tasks: {id: number}[]
}

interface NewSprintResponseDataType {
  sprint: SprintType,
  tasks: Task[]
}

interface SprintsStateType {
  active: SprintType[] | null
  planning: SprintType[] | null
}
  
  interface SprintsContextProps {
    sprints: SprintsStateType,
    setSprints: Dispatch<SetStateAction<SprintsStateType>>;
    addNewSprint: (data: NewSprintType) => Promise<{ status: string, text: string }>
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
    const [sprints, setSprints] = useState<SprintsStateType>({active: null, planning: null });
    const { project } = useProjectCtx();
    const { setTasks } = useTasksCtx(); 


    const addNewSprint = async (data: NewSprintType) => {
      try {
        const dataToSend = {...data, projectId: project!.id}
        const response = await axios.post(
          "http://localhost:3002/api/sprint",
          dataToSend
        );
        if (response.status == 200 || response.status == 201) {
          const responseData: NewSprintResponseDataType = response.data.data;
          setSprints((prevData) => ({
            active: prevData.active, 
            planning: [...(prevData.planning || []), responseData.sprint]
          }));
          setTasks((prevTasks) =>
            prevTasks.map((task) => {
              // Find if the current task is in the updated tasks array
              const updatedTask = responseData.tasks.find((t) => t.id === task.id);
              // Update only if task is in updatedTasks array, otherwise return the task as-is
              return updatedTask ? { ...task, ...updatedTask } : task;
            })
          );
          console.log(response.data.data)
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
    
  
    const ctxValue = {
        sprints,
        setSprints,
        addNewSprint
    };
  
    return (
      <SprintsContext.Provider value={ctxValue}>
        {children}
      </SprintsContext.Provider>
    );
  };
  