"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { formatRelativeDate, isOverdue } from "./lib/date-utils";

interface DueDateBadgeProps {
  date: Date | undefined;
  isDone?: boolean;
  className?: string;
}

export function DueDateBadge({ date, isDone = false, className = "" }: DueDateBadgeProps) {
  if (!date) return null;

  const overdue = isOverdue(date);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <HugeiconsIcon
        icon={Calendar02Icon}
        size={14}
        className={overdue && !isDone ? "text-orange-400" : "text-zinc-500"}
      />
      <span
        className={`text-xs font-mono ${
          overdue && !isDone
            ? "text-orange-400"
            : isDone
              ? "text-zinc-500"
              : "text-zinc-400"
        }`}
      >
        {formatRelativeDate(date)}
      </span>
    </div>
  );
}
