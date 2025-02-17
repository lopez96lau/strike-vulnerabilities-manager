import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  id: string;
  children: React.ReactNode;
  color: string;
  className: string;
}

const dndColorVariants = {
  gray: "!border-gray-900 border-2 bg-gray-200",
  pink: "!border-pink-900 border-2 bg-pink-200",
  amber: "!border-amber-900 border-2 bg-amber-200",
  blue: "!border-blue-900 border-2 bg-blue-200",
  red: "!border-red-900 border-2 bg-red-200",
  green: "!border-green-900 border-2 bg-green-200",
};

export const DroppableStatusColumn = ({
  id,
  children,
  color,
  className,
}: Props) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${
        isOver ? dndColorVariants[color as keyof typeof dndColorVariants] : ""
      }`}
      style={{ pointerEvents: "none" }}
    >
      <div style={{ pointerEvents: "auto" }}>{children}</div>
    </div>
  );
};
