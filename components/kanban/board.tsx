"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AddTaskDialog } from "./add-task-dialog";
import { KanbanColumn } from "./column";
import { KanbanHeader } from "./header";
import type { ColumnType, Task, TaskInput } from "./types";

const COLUMNS: ColumnType[] = ["todo", "in-progress", "done"];

const STORAGE_KEY = "kanban-tasks";
const ALL_CATEGORIES_KEY = "kanban-all-categories";

function extractAllCategories(tasks: Task[]): string[] {
  const allCategories = new Set<string>();
  tasks.forEach((task) => {
    if (task.category) {
      task.category.forEach((cat) => {
        allCategories.add(cat);
      });
    }
  });
  return Array.from(allCategories);
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setMounted(true);
  }, []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnType | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    const allCategories = extractAllCategories(tasks);
    localStorage.setItem(ALL_CATEGORIES_KEY, allCategories.join(","));
  }, [tasks, mounted]);

  const handleAddTask = useCallback(
    (input: TaskInput, column: ColumnType) => {
      const columnTasks = tasks.filter((t) => t.column === column);
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...input,
        column,
        createdAt: new Date(),
        order: columnTasks.length,
      };
      setTasks((prev) => [...prev, newTask]);
    },
    [tasks],
  );

  const handleTaskDrop = useCallback((taskId: string, targetColumn: ColumnType) => {
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
    setDragOverColumn(null);
    setDraggingTaskId(null);
  }, []);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggingTaskId(taskId);
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

  const safeTasks = useMemo(() => (mounted ? tasks : []), [mounted, tasks]);

  const getTasksByColumn = useCallback(
    (column: ColumnType) =>
      safeTasks
        .filter((task) => task.column === column)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [safeTasks],
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
                draggingTaskId={draggingTaskId}
              />
            ))}
          </div>
        </div>
      </main>
      <AddTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddTask} />
    </div>
  );
}
