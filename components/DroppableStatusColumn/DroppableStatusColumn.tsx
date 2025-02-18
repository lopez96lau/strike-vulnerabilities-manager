import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { dndColorVariants } from "@/utils/assets";

interface Props {
  id: string;
  children: React.ReactNode;
  color: string;
  className: string;
}

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
      } pointer-events-none`}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
};
