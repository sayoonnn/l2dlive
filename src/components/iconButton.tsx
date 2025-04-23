import React from "react";

export default function IconButton({
  clickEvent,
  type,
  className,
  text,
}: Readonly<{
  type: string;
  className?: string;
  clickEvent?: () => void;
  text?: string;
}>) {
  return (
    <button
      className={`cursor-pointer rounded-full flex items-center justify-center ${className} p-7`}
      type="button"
      onClick={clickEvent}
    >
      <div className="flex items-center justify-center w-[20px] h-[20px]">
        <span className="material-symbols-rounded !text-4xl">{type}</span>
        <span className="text-xl font-bold">{text}</span>
      </div>
    </button>
  );
}
