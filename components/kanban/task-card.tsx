"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { DueDateBadge } from "./due-date-badge";
import type { Task } from "./types";
import { PRIORITY_CONFIG } from "./types";
import { formatShortDate } from "./lib/date-utils";

interface TaskCardProps {
  task: Task;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, onDragStart, onDragEnd, isDragging, onClick }: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const isDone = task.column === "done";

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id.toString());
    onDragStart?.(task.id.toString());
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(task)}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(task)}
      role="button"
      tabIndex={0}
      data-task-id={task.id}
      className={`min-h-[80px] rounded-xl border border-input bg-muted p-3 transition-all duration-200 cursor-pointer ${
        isDragging ? "opacity-40 scale-[0.98]" : ""
      } ${isDone ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-sm font-medium leading-normal ${
            isDone ? "line-through text-muted-foreground" : "text-foreground"
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityConfig.className}`}
        >
          {priorityConfig.label}
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-2.5 flex items-center justify-between">
        <DueDateBadge date={task.dueDate} isDone={isDone} />
        {isDone && task.completedAt && (
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={Tick02Icon} size={12} className="text-emerald-500" />
            <span className="text-xs text-muted-foreground font-mono">
              {formatShortDate(new Date(task.completedAt))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}