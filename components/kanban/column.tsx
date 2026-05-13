"use client";

import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import type { ColumnType, Task } from "./types";
import { COLUMN_CONFIG } from "./types";
import { InlineAdd } from "./inline-add";
import type { TaskInput } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

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
  onOpenAddDialog?: () => void;
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
      className={`flex flex-col min-w-0 rounded-xl border border-border/40 transition-all duration-200 ${
        isDragOver ? config.dragHighlight : ""
      } bg-card`}
      data-column-id={id}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${config.dot}`} />
          <h2 className={`text-sm font-medium ${config.color}`}>{config.title}</h2>
          <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-full">
            {columnCount}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 border-border/50"
          onClick={() => onOpenAddDialog?.()}
        >
          <HugeiconsIcon icon={Add01Icon} size={14} />
        </Button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-1">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingTaskId === task.id.toString()}
            onClick={onTaskClick}
            index={index}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-xs text-muted-foreground">
            <span>No tasks</span>
          </div>
        )}
        {onAddTask && (
          <div className="mt-2">
            <InlineAdd
              column={id}
              onAdd={onAddTask}
              onOpenFullDialog={onOpenAddDialog}
            />
          </div>
        )}
      </div>
    </div>
  );
}