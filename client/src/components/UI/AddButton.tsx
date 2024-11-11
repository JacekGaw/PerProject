import React, {useState} from 'react';
import { motion } from 'framer-motion';
import addIcon from "../../assets/img/plus.svg"
import { useAuth } from '../../store/AuthContext';
import { useProjectCtx } from '../../store/ProjectsContext';
import { useTasksCtx } from '../../store/TasksContext';

interface AddButtonTypes {
    type: "task" | "subtask",
    placeholder?: string,
    taskId?: number
    sprintId?: number
}

const button = {
    open: { scale: 1, borderRadius: "50%" },
    close: { scale: 1, borderRadius: "0%" },
    hover: {scale: 1.05 }
  };
  const icon = {
    open: { rotate: 0 },
    close: { rotate: 45 },
  };


const AddButton: React.FC<AddButtonTypes> = ({type, placeholder, taskId, sprintId}) => {
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const { user, logOut } = useAuth();
    const { project } = useProjectCtx()
    const {addNewTask} = useTasksCtx()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsError(false);
        const formData = new FormData(e.currentTarget);
        const taskText = formData.get('taskText') as string;
        if(!user || !project) {
            return logOut();
        }
        let data = {}   
        if(type === "task"){
            data = {
                taskText: taskText,
                authorId: user.id,
                assignedTo: user.id,
                projectId: project.id,
            }
        }
        else {
            data = {
                taskText: taskText,
                authorId: user.id,
                assignedTo: user.id,
                taskId: taskId
            }
        }
        if(sprintId) {
            data = {...data, sprintId: sprintId}
        }
        else {
            data = {...data, sprintId: null}
        }
        
        try {
            const response = await addNewTask(type, data);
            if(response.status === "Success"){
                setInputVisible(false);
                setIsError(false);
            }
            else {
                setIsError(true);
            }
        } catch (err) {
            setIsError(true);
        }
      }

    return (
        <>
        {inputVisible && 
            <motion.form className="absolute right-full z-10 flex px-2 gap-2" onSubmit={onSubmit}>
                <input name="taskText" id="taskText" type="text" placeholder={placeholder} className={` text-base ${isError ? "bg-red-600" : "bg-darkest-blue" }`} required />
                <button type="submit" className="">Add</button>
            </motion.form>
            }
            
            <motion.button
              variants={button}
              initial="open"
              whileHover="hover"
              animate={inputVisible ? "close" : "open"}
              onClick={() => setInputVisible((prevState) => !prevState)}
              className="bg-gradient-to-r from-normal-orange to-vibrant-orange p-2 w-8 h-8 flex justify-center z-30 items-center"
            >
              <motion.img
                variants={icon}
                initial="open"
                animate={inputVisible ? "close" : "open"}
                src={addIcon}
                alt="Add New Project"
                className="w-4"
              />
            </motion.button>
        </>
    ) 
}

export default AddButton;