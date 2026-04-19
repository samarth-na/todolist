"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { TaskCard } from "./task-card";
import type { ColumnType, Task } from "./types";
import { COLUMN_CONFIG } from "./types";
import { InlineAdd } from "./inline-add";
import type { TaskInput } from "./types";

interface KanbanColumnProps {
  id: ColumnType;
  tasks: Task[];
  allTasks?: Task[];
  totalTaskCount?: number;
  onTaskDrop?: (taskId: number, targetColumn: ColumnType) => void;
  isDragOver?: boolean;
  onDragOver?: (column: ColumnType) => void;
  onDragLeave?: () => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  draggingTaskId?: string | null;
  onAddTask?: (input: TaskInput, column: ColumnType) => void;
  onTaskClick?: (task: Task) => void;
  onOpenAddDialog?: (column: ColumnType) => void;
}

export function KanbanColumn({
  id,
  tasks,
  allTasks = [],
  totalTaskCount = 0,
  onTaskDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDragStart,
  onDragEnd,
  draggingTaskId,
  onAddTask,
  onTaskClick,
  onOpenAddDialog,
}: KanbanColumnProps) {
  const config = COLUMN_CONFIG[id];
  const columnCount = tasks.length;

  const progressColor =
    id === "todo"
      ? "bg-amber-500 dark:bg-amber-400"
      : id === "in-progress"
        ? "bg-emerald-500 dark:bg-emerald-400"
        : "bg-sky-500 dark:bg-sky-400";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver?.(id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    onTaskDrop?.(Number(taskId), id);
  };

  return (
    <div
      className={`flex flex-col min-w-0 rounded-xl border border-border transition-all duration-200 ${
        isDragOver ? config.dragHighlight : ""
      } bg-card`}
      data-column-id={id}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${config.dot}`} />
          <h2 className={`text-sm font-medium ${config.color}`}>{config.title}</h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {columnCount}
        </span>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono text-muted-foreground">
            {columnCount} / {totalTaskCount}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {totalTaskCount > 0
              ? Math.round((columnCount / totalTaskCount) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="h-0.5 w-full bg-border rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-300`}
            style={{
              width: `${totalTaskCount > 0 ? (columnCount / totalTaskCount) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingTaskId === task.id.toString()}
            onClick={onTaskClick}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-xs text-muted-foreground font-mono">
            <span>No tasks</span>
          </div>
        )}
        {onAddTask && (
          <InlineAdd
            column={id}
            onAdd={onAddTask}
            onOpenFullDialog={() => onOpenAddDialog?.(id)}
          />
        )}
      </div>
    </div>
  );
}