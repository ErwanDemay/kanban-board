import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
    bg-gray-800
    opacity-40
    border-2
    border-gray-600
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
  "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
    bg-gray-800
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    shadow-lg
  "
    >
      {/* column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-gray-800
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      p-3
      font-bold
      border-gray-600
      border-4
      flex
      items-center
      justify-between
      text-white
    "
      >
        <div className="flex gap-2">
          <div
            className="
          flex
          justify-center
          items-center
          bg-gray-800
          px-2
          py-1
          text-sm
          rounded-full
          border
          border-gray-600
          text-white
        "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="
            bg-gray-800
            focus:border-gray-400
            border
            rounded
            outline-none
            px-2
            text-white
          "
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-gray-600
        rounded
        px-1
        py-2
        transition-colors
        duration-200
      "
        >
          <TrashIcon />
        </button>
      </div>

      {/* column task container */}
      <div
        className="
      flex
      flex-grow
      flex-col
      gap-4
      p-2
      overflow-x-hidden
      overflow-y-auto
    "
      >
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* column footer */}
      <button
        className="
      flex
      gap-2
      items-center
      justify-center
      border-2
      border-gray-600
      rounded-md
      p-4
      text-white
      hover:bg-gray-600
      hover:text-white
      transition-all
      duration-200
    "
        onClick={() => {
          createTask(column.id);
        }}
      >
        Add task
        <PlusIcon />
      </button>
    </div>
  );
};

export default ColumnContainer;
