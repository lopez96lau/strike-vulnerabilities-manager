import React, { ReactNode } from "react";
import { badgeColorVariants } from "@/utils/assets";

interface BadgeProps {
  color: string;
  children: ReactNode;
  label?: string;
  title?: string;
}

export const Badge = (badge: BadgeProps) => {
  return (
    <div
      className={`${
        badgeColorVariants[badge.color as keyof typeof badgeColorVariants]
      } flex flex-row items-center ${
        badge.label ? "px-3" : "px-2"
      } rounded-full gap-1 py-2 font-semibold text-sm`}
      title={badge.title}
    >
      {badge.children}
      {badge.label}
    </div>
  );
};
