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
        size={12}
        className={overdue && !isDone ? "text-orange-500" : "text-muted-foreground"}
      />
      <span
        className={`text-xs ${
          overdue && !isDone
            ? "text-orange-500"
            : "text-muted-foreground"
        }`}
      >
        {formatRelativeDate(date)}
      </span>
    </div>
  );
}
