import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

function ColumnContainer({ column, deleteColumn }: Props) {
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
    bg-black
    opacity-40
    border-2
    border-rose-500
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
      bg-black
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
  "
    >
      {/* column title */}
      <div
        {...attributes}
        {...listeners}
        className="bg-black
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      p-3
      font-bold
      border-red-500
      border-4
      flex
      items-center
      justify-between
      "
      >
        <div className="flex gap-2">
          <div
            className="
        flex
        justify-center
        items-center
        bg-black
        px-2
        py-1
        text-sm
        rounded-full
        "
          >
            0
          </div>
          {column.title}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="
      stroke-gray-500
      hover:stroke-white
      hover:bg-amber-400
      rounded
      px-1
      py-2
      "
        >
          <TrashIcon />
        </button>
      </div>

      {/* column task container */}
      <div className="flex flex-grow border-white border-4">Content</div>
      {/* column footer */}
      <div>Footer</div>
    </div>
  );
}

export default ColumnContainer;
