"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { AddTaskDialog } from "./add-task-dialog";
import { KanbanColumn } from "./column";
import { KanbanHeader } from "./header";
import { TaskDetailDialog } from "./task-detail-dialog";
import type { ColumnType, Task, TaskInput, FilterState } from "./types";
import { addTask, updateTask } from "@/app/actions";

const COLUMNS: ColumnType[] = ["todo", "in-progress", "done"];

interface KanbanBoardProps {
  initialTasks: Task[];
  initialCategories: string[];
}

export function KanbanBoard({ initialTasks, initialCategories }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnType | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>({ search: "", priority: "all" });
  const [, startTransition] = useTransition();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.category?.some((c) => c.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesPriority =
        filters.priority === "all" || task.priority === filters.priority;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, filters]);

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

  const handleTaskDrop = useCallback(
    (taskId: number, targetColumn: ColumnType) => {
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

        const update: Partial<Task> = { column: targetColumn, order: newOrder };
        if (targetColumn === "done") {
          update.completedAt = new Date();
        } else if (task.column === "done") {
          update.completedAt = undefined;
        }

        return prev.map((t) => {
          if (t.id === taskId) {
            return { ...t, ...update };
          }
          return t;
        });
      });

      startTransition(async () => {
        try {
          const updateData: { column: ColumnType; completedAt?: Date } = {
            column: targetColumn,
          };
          if (targetColumn === "done") {
            updateData.completedAt = new Date();
          }
          await updateTask(taskId, updateData);
        } catch (e) {
          console.error("Failed to update task:", e);
        }
      });

      setDragOverColumn(null);
      setDraggingTaskId(null);
    },
    [],
  );

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
      filteredTasks
        .filter((task) => task.column === column)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [filteredTasks],
  );

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  }, []);

  const handleDetailSave = useCallback(
    async (taskId: number, updates: Partial<TaskInput>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
      startTransition(async () => {
        try {
          await updateTask(taskId, updates);
        } catch (e) {
          console.error("Failed to update task:", e);
        }
      });
      setDetailDialogOpen(false);
      setSelectedTask(null);
    },
    [],
  );

  const handleDetailDelete = useCallback(
    async (taskId: number) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      startTransition(async () => {
        try {
          await updateTask(taskId, { column: "done" });
        } catch (e) {
          console.error("Failed to delete task:", e);
        }
      });
      setDetailDialogOpen(false);
      setSelectedTask(null);
    },
    [],
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-full min-w-[680px] sm:min-w-[760px] max-w-[1200px] mx-auto">
          <KanbanHeader
            onAddClick={() => setDialogOpen(true)}
            filters={filters}
            onFiltersChange={setFilters}
            taskCount={filteredTasks.length}
          />
        </div>
      </div>
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
        <div className="h-full min-w-[680px] sm:min-w-[760px] max-w-[1200px] mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-5 lg:gap-6 h-full">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column}
                id={column}
                tasks={getTasksByColumn(column)}
                allTasks={filteredTasks}
                totalTaskCount={filteredTasks.length}
                onTaskDrop={handleTaskDrop}
                isDragOver={dragOverColumn === column}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggingTaskId={draggingTaskId?.toString() ?? null}
                onAddTask={handleAddTask}
                onTaskClick={handleTaskClick}
                onOpenAddDialog={() => setDialogOpen(true)}
              />
            ))}
          </div>
        </div>
      </main>
      <AddTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddTask} />
      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onSave={handleDetailSave}
          onDelete={handleDetailDelete}
        />
      )}
    </div>
  );
}
