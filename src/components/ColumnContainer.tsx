import { Column, Id } from "../types";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

function ColumnContainer(Props: Props) {
  const { column, deleteColumn } = Props;
  return (
    <div
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
        className="bg-black
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      p-3
      font-bold
      border-white
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
        Delete
      </button>
      {/* column task container */}
      <div className="flex flex-grow border-white border-4">Content</div>
      {/* column footer */}
      <div>Footer</div>
    </div>
  );
}

export default ColumnContainer;
