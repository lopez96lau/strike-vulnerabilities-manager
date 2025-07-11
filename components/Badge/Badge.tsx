import React, { ReactNode } from "react";
interface BadgeProps {
  color: string;
  children: ReactNode;
  label?: string;
  title?: string;
}

const badgeColorVariants = {
  gray: "bg-gray-200 text-gray-900",
  pink: "bg-pink-200 text-pink-900",
  amber: "bg-amber-200 text-amber-900",
  blue: "bg-blue-200 text-blue-900",
  red: "bg-red-200 text-red-900",
  green: "bg-green-200 text-green-900",
};

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
