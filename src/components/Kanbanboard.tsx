import { useEffect, useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensor,
  PointerSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function Kanbanboard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>([]);

  // Charger les données au démarrage
  useEffect(() => {
    const { savedColumns, savedTasks } = loadFromLocalStorage();
    setColumns(savedColumns);
    setTasks(savedTasks);
  }, []);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  // Sauvegarder les données dans localStorage
  const saveToLocalStorage = (columns, tasks) => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  };

  // Charger les données depuis localStorage
  const loadFromLocalStorage = () => {
    const savedColumns = JSON.parse(
      localStorage.getItem("kanbanColumns") || "[]"
    );
    const savedTasks = JSON.parse(localStorage.getItem("kanbanTasks") || "[]");
    return { savedColumns, savedTasks };
  };

  return (
    <div
      className="
      m-auto
      flex
      flex-col
      min-h-screen
      w-full
      items-center
      overflow-x-auto
      overflow-y-hidden
      px-10
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="
            h-[60px]
            w-[350px]
            min-w-[350px]
            cursor-pointer
            rounded-lg
            bg-gray-800
            border-2
            border-gray-600
            p-4
            hover:ring-2
            hover:ring-gray-400
            flex
            gap-2
            items-center
            justify-center
            text-white
            transition-all
            duration-200
            hover:bg-gray-600
            hover:text-white
          "
          >
            <PlusIcon />
            Add column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveToLocalStorage(columns, newTasks); // Sauvegarder après modification
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    saveToLocalStorage(columns, newTasks); // Sauvegarder après modification
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
    saveToLocalStorage(columns, newTasks); // Sauvegarder après modification
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    const newColumns = [...columns, columnToAdd];
    setColumns(newColumns);
    saveToLocalStorage(newColumns, tasks); // Sauvegarder après modification
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
    saveToLocalStorage(filteredColumns, newTasks); // Sauvegarder après modification
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
    saveToLocalStorage(newColumns, tasks); // Sauvegarder après modification
  }

  function onDragStart(event: DragStartEvent) {
    console.log("DRAG START", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (
      active.data.current?.type === "Column" &&
      over.data.current?.type === "Column"
    ) {
      const activeIndex = columns.findIndex((col) => col.id === activeId);
      const overIndex = columns.findIndex((col) => col.id === overId);

      const newColumns = arrayMove(columns, activeIndex, overIndex);
      setColumns(newColumns);
      saveToLocalStorage(newColumns, tasks); // Sauvegarder après modification
    }

    if (
      active.data.current?.type === "Task" &&
      over.data.current?.type === "Task"
    ) {
      const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
      const overTaskIndex = tasks.findIndex((task) => task.id === overId);

      const activeTask = tasks[activeTaskIndex];
      const overTask = tasks[overTaskIndex];

      if (activeTask.columnId === overTask.columnId) {
        const newTasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);
        setTasks(newTasks);
        saveToLocalStorage(columns, newTasks); // Sauvegarder après modification
      } else {
        const updatedTasks = [...tasks];
        updatedTasks[activeTaskIndex] = {
          ...activeTask,
          columnId: overTask.columnId,
        };
        setTasks(updatedTasks);
        saveToLocalStorage(columns, updatedTasks); // Sauvegarder après modification
      }
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a task over another task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default Kanbanboard;
