import React, { useState } from "react";
import { Id, Task } from "../types";
import TrashIcon from "../icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [MouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
    opacity-30
    bg-gray-700
    p-2.5
    h-[100px]
    min-h-[100px]
    items-center
    flex
    text-left
    rounded-xl
    border-2
    border-gray-600
    cursor-grab
    relative
    task
  "
      ></div>
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="
        bg-gray-700
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        border-2
        border-gray-600
        cursor-grab
        relative
        hover:ring-2
        hover:ring-gray-400
      "
      >
        <textarea
          className="
          h-[90px]
          w-full
          resize-none
          border-none
          rounded
          bg-transparent
          text-white
          focus:outline-none
          placeholder:text-gray-300
        "
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="
    bg-gray-700
    p-2.5
    h-[100px]
    min-h-[100px]
    items-center
    flex
    text-left
    rounded-xl
    border-2
    border-gray-600
    cursor-grab
    relative
    hover:ring-2
    hover:ring-gray-400
  "
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p
        className="
      my-auto
      h-[90%]
      w-full
      overflow-y-auto
      overflow-x-hidden
      whitespace-pre-wrap
      text-white
    "
      >
        {task.content}
      </p>
      {MouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="
        stroke-white
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        bg-gray-700
        p-2
        rounded
        opacity-60
        hover:opacity-100
        transition-opacity
        duration-200
      "
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
