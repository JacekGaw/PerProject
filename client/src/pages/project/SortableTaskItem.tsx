import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../../store/TasksContext";
import TaskItem from "./TaskItem";

interface SortableTaskItemProps {
  item: Task;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    data: {
      type: 'task',
      task: item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`
        cursor-grab 
        active:cursor-grabbing 
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        transition-opacity
        relative
      `}
    >
      {/* Add drag handle indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/20 group-hover:bg-blue-500/50 transition-colors" />
      <TaskItem item={item} />
    </div>
  );
};

export default SortableTaskItem;