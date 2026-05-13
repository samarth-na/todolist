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
  index?: number;
}

export function TaskCard({ task, onDragStart, onDragEnd, isDragging, onClick, index }: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const isDone = task.column === "done";

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id.toString());
    onDragStart?.(task.id.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(task);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(task)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      data-task-id={task.id}
      aria-grabbed={isDragging}
      style={{ "--task-index": index ?? 0 } as React.CSSProperties}
      className={`group rounded-lg border border-border/40 bg-card p-3 transition-all duration-200 cursor-pointer hover:border-primary/50 hover:shadow-sm hover:-translate-y-px active:translate-y-0 active:scale-[0.99] ${
        isDragging ? "opacity-95 scale-[1.02] rotate-1 shadow-lg cursor-grabbing" : "cursor-grab"
      } ${isDone ? "bg-muted/50" : ""}`}
    >
      {/* Title row - priority badge aligned with title */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`text-sm font-medium leading-snug flex-1 min-w-0 ${
            isDone ? "line-through text-muted-foreground" : "text-foreground"
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-[11px] px-2 py-0.5 rounded-md font-medium ${priorityConfig.className}`}
        >
          {priorityConfig.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-snug">
          {task.description}
        </p>
      )}

      {/* Metadata row */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <DueDateBadge date={task.dueDate} isDone={isDone} />
        {isDone && task.completedAt && (
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={Tick02Icon} size={11} className="text-emerald-500" />
            <span className="text-[11px] text-muted-foreground font-mono">
              {formatShortDate(new Date(task.completedAt))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
