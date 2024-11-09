import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/UI/Button';

interface GeneratedSubtask {
    taskText: string;
    description: string;
}

interface GeneratedSubtasksModalProps {
    data: GeneratedSubtask[];
}

const GeneratedSubtasksModal: React.FC<GeneratedSubtasksModalProps> = ({ data }) => {
    const [subtasks, setSubtasks] = useState<GeneratedSubtask[]>(data);
    const [checkedArr, setCheckedArr] = useState<number[]>([]);

    const handleToggleCheckbox = (index: number) => {
        setCheckedArr((prevCheckedArr) => 
            prevCheckedArr.includes(index)
                ? prevCheckedArr.filter((i) => i !== index) // Uncheck if already checked
                : [...prevCheckedArr, index] // Add if not checked
        );
    };

    const handleSelectAll = () => {
        setCheckedArr(subtasks.map((_, index) => index)); // Select all indices
    };

    const handleResetSelection = () => {
        setCheckedArr([]); // Clear all selections
    };

    const handleSaveChecked = () => {
        const selectedSubtasks = subtasks.filter((_, index) => checkedArr.includes(index));
        console.log('Selected Subtasks:', selectedSubtasks);
        // Perform save operation with selectedSubtasks
    };

    return (
        <div className="w-full max-w-screen-sm flex flex-col gap-5 p-5">
            <header className="p-2 border-b border-b-slate-400">
                <h1 className="text-lg font-[600]">Generated Subtasks:</h1>
            </header>
            <ul className="flex flex-col gap-2">
                {subtasks.map((subtask, index) => (
                    <motion.li
                        key={subtask.taskText}
                        onClick={() => handleToggleCheckbox(index)}
                        className="flex gap-5 p-5 rounded-xl cursor-pointer"
                        initial={{ backgroundColor: '#0C1A2E' }}
                        animate={{
                            backgroundColor: checkedArr.includes(index) ? '#315993' : '#0C1A2E'
                        }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <input
                            type="checkbox"
                            checked={checkedArr.includes(index)}
                            readOnly
                            className="pointer-events-none"
                        />
                        <div className="flex flex-col gap-1">
                            <h5 className="text-sm font-[600]">{subtask.taskText}</h5>
                            <p className="text-xs font-[400] text-slate-400">{subtask.description}</p>
                        </div>
                    </motion.li>
                ))}
            </ul>
            <div className="flex justify-end gap-5 items-center">
                <button onClick={handleResetSelection} className='underline text-sm text-slate-200'>Reset Selection</button>
                <button onClick={handleSelectAll} className='underline text-sm text-slate-200'>Select All</button>
                <Button onClick={handleSaveChecked}>Save Checked</Button>
            </div>
        </div>
    );
};

export default GeneratedSubtasksModal;
