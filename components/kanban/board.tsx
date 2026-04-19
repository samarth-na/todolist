"use client";

import { useCallback, useMemo, useState, useTransition, startTransition } from "react";
import { AddTaskDialog } from "./add-task-dialog";
import { KanbanColumn } from "./column";
import { KanbanHeader } from "./header";
import type { ColumnType, Task, TaskInput } from "./types";
import { addTask, updateTask } from "@/app/actions";

const COLUMNS: ColumnType[] = ["todo", "in-progress", "done"];

interface KanbanBoardProps {
  initialTasks: Task[];
  initialCategories: string[];
}

export function KanbanBoard({ initialTasks, initialCategories }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnType | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const handleAddTask = useCallback(
    (input: TaskInput, column: ColumnType) => {
      const columnTasks = tasks.filter((t) => t.column === column);
      const newOrder = columnTasks.length;
      
      const optimisticTask: Task = {
        id: Date.now(),
        ...input,
        column,
        createdAt: new Date(),
        order: newOrder,
      };
      
      setTasks((prev) => [...prev, optimisticTask]);
      
      startTransition(async () => {
        try {
          const result = await addTask(input, column);
          setTasks((prev) =>
            prev.map((t) => (t.id === optimisticTask.id ? { ...t, id: result.id } : t))
          );
        } catch (e) {
          console.error("Failed to add task:", e);
        }
      });
    },
    [tasks],
  );

  const handleTaskDrop = useCallback((taskId: number, targetColumn: ColumnType) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;

      if (task.column === targetColumn) {
        return prev;
      }

      const targetColumnTasks = prev
        .filter((t) => t.column === targetColumn && t.id !== taskId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const newOrder = targetColumnTasks.length;

      return prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, column: targetColumn, order: newOrder };
        }
        return t;
      });
    });

    startTransition(async () => {
      try {
        await updateTask(taskId, { column: targetColumn });
      } catch (e) {
        console.error("Failed to update task:", e);
      }
    });

    setDragOverColumn(null);
    setDraggingTaskId(null);
  }, []);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggingTaskId(Number(taskId));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragOverColumn(null);
    setDraggingTaskId(null);
  }, []);

  const handleDragOver = useCallback((column: ColumnType) => {
    setDragOverColumn(column);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const getTasksByColumn = useCallback(
    (column: ColumnType) =>
      tasks
        .filter((task) => task.column === column)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [tasks],
  );

  return (
    <div className="flex flex-col h-screen">
      <KanbanHeader onAddClick={() => setDialogOpen(true)} />
      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        <div className="max-w-[1200px] mx-auto h-full">
          <div className="grid grid-cols-3 gap-4 md:gap-6 min-w-[800px] h-full">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column}
                id={column}
                tasks={getTasksByColumn(column)}
                onTaskDrop={handleTaskDrop}
                isDragOver={dragOverColumn === column}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggingTaskId={draggingTaskId?.toString() ?? null}
              />
            ))}
          </div>
        </div>
      </main>
      <AddTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddTask} />
    </div>
  );
}
