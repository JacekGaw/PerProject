import React, { ReactElement } from "react";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTasksCtx, Task } from "../../store/TasksContext";
import { useSprintsCtx } from "../../store/SprintsContext";
import BacklogList from "./BacklogList";
import SprintList from "./SprintList";
import TaskItem from "./TaskItem";

const DroppableContainer: React.FC<{
  id: string;
  children: ReactElement;
  isDragging: boolean;
}> = ({ id, children, isDragging }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      data-droppable-id={id}
      className={`p-4 rounded-lg transition-colors min-h-[100px] ${
        isDragging ? "bg-slate-800/50" : ""
      }`}
    >
      {children}
    </div>
  );
};

const SprintView: React.FC = () => {
  const { tasks, changeTask } = useTasksCtx();
  const { sprints } = useSprintsCtx();
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedTask = tasks?.find((task) => task.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
      setIsDragging(true);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) return;
    const overId = over.id.toString();
    if (!overId.startsWith("sprint-") && overId !== "backlog") {
      const overTask = tasks?.find((task) => task.id === over.id);
      if (overTask) {
        event.over = {
          ...over,
          id: overTask.sprintId ? `sprint-${overTask.sprintId}` : "backlog",
        };
      }
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setIsDragging(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setIsDragging(false);

    if (!over) return;

    let overId = over.id.toString();
    const activeTask = tasks?.find((task) => task.id === active.id);
    if (!activeTask) return;

    if (!overId.startsWith("sprint-") && overId !== "backlog") {
      const overTask = tasks?.find((task) => task.id === over.id);
      if (overTask) {
        overId = overTask.sprintId ? `sprint-${overTask.sprintId}` : "backlog";
      }
    }

    const currentSprintId = activeTask.sprintId;
    const newSprintId =
      overId === "backlog"
        ? null
        : overId.startsWith("sprint-")
        ? parseInt(overId.replace("sprint-", ""))
        : currentSprintId;

    if (currentSprintId === newSprintId) return;

    try {
      const updateData: Partial<Task> = {
        id: activeTask.id,
        sprintId: newSprintId,
      };

      const response = await changeTask("task", activeTask.id, updateData);
      if (response.status === "Error") {
        console.error("Failed to update task:", response.text);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getTaskIds = (taskList: Task[] | undefined) => {
    return taskList ? taskList.map((task) => task.id) : [];
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <section className="flex flex-col">
        {sprints.active &&
          tasks &&
          sprints.active.map((sprint) => (
            <SortableContext
              key={`sprint-${sprint.id}`}
              id={`sprint-${sprint.id}`}
              items={getTaskIds(
                tasks.filter((task) => task.sprintId === sprint.id)
              )}
              strategy={verticalListSortingStrategy}
            >
              <DroppableContainer
                id={`sprint-${sprint.id}`}
                isDragging={isDragging}
              >
                <SprintList
                  sprint={sprint}
                  tasks={tasks.filter((task) => task.sprintId === sprint.id)}
                />
              </DroppableContainer>
            </SortableContext>
          ))}

        {sprints.planning &&
          tasks &&
          sprints.planning.map((sprint) => (
            <SortableContext
              key={`sprint-${sprint.id}`}
              id={`sprint-${sprint.id}`}
              items={getTaskIds(
                tasks.filter((task) => task.sprintId === sprint.id)
              )}
              strategy={verticalListSortingStrategy}
            >
              <DroppableContainer
                id={`sprint-${sprint.id}`}
                isDragging={isDragging}
              >
                <SprintList
                  sprint={sprint}
                  tasks={tasks.filter((task) => task.sprintId === sprint.id)}
                />
              </DroppableContainer>
            </SortableContext>
          ))}

        {tasks && (
          <SortableContext
            id="backlog"
            items={getTaskIds(tasks.filter((task) => task.sprintId === null))}
            strategy={verticalListSortingStrategy}
          >
            <DroppableContainer id="backlog" isDragging={isDragging}>
              <BacklogList
                tasks={tasks.filter((task) => task.sprintId === null)}
              />
            </DroppableContainer>
          </SortableContext>
        )}
      </section>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="opacity-80">
            <TaskItem item={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SprintView;
