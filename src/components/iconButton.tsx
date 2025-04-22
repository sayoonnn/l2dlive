import React from "react";

export default function IconButton({
  clickEvent,
  type,
  className,
}: Readonly<{ type: string; className?: string; clickEvent?: () => void }>) {
  return (
    <button
      className={`cursor-pointer rounded-full flex items-center justify-center ${className} p-7`}
      type="button"
      onClick={clickEvent}
    >
      <div className="flex items-center justify-center w-[20px] h-[20px]">
        <span className="material-symbols-rounded !text-4xl">{type}</span>
      </div>
    </button>
  );
}
