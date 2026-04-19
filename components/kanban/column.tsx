"use client";

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
      className={`flex flex-col min-w-0 rounded-2xl border border-border/40 transition-all duration-200 ${
        isDragOver ? config.dragHighlight : ""
      } bg-card`}
      data-column-id={id}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header - more presence with generous padding */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className={`h-2 w-2 rounded-full ${config.dot}`} />
          <h2 className={`text-sm font-medium ${config.color}`}>{config.title}</h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono tabular-nums bg-muted/50 px-2 py-0.5 rounded-full">
          {columnCount}
        </span>
      </div>

      {/* Task List - rhythmic spacing with breathing room */}
      <div className="flex flex-col gap-2.5 p-2.5 sm:p-3 overflow-y-auto flex-1">
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
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-xs text-muted-foreground font-mono">
            <span>No tasks</span>
          </div>
        )}
        {onAddTask && (
          <div className="mt-1">
            <InlineAdd
              column={id}
              onAdd={onAddTask}
              onOpenFullDialog={() => onOpenAddDialog?.(id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}