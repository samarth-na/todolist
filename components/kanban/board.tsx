'use client';

import { useState, useCallback } from 'react';
import { KanbanHeader } from './header';
import { KanbanColumn } from './column';
import { AddTaskDialog } from './add-task-dialog';
import type { Task, TaskInput, ColumnType } from './types';

const INITIAL_TASKS: Task[] = [
    {
        id: '1',
        title: 'Design system architecture',
        description:
            'Define the component hierarchy and data flow patterns for the application',
        priority: 'high',
        column: 'todo',
        createdAt: new Date(),
        order: 0,
    },
    {
        id: '2',
        title: 'Set up authentication',
        description: 'Implement OAuth login with Google and GitHub providers',
        priority: 'urgent',
        column: 'in-progress',
        createdAt: new Date(),
        order: 0,
    },
    {
        id: '3',
        title: 'Write documentation',
        priority: 'medium',
        column: 'todo',
        createdAt: new Date(),
        order: 1,
    },
    {
        id: '4',
        title: 'Fix navigation bug',
        description:
            "User reported that the sidebar doesn't collapse on mobile",
        priority: 'low',
        column: 'done',
        createdAt: new Date(),
        order: 0,
    },
];

const COLUMNS: ColumnType[] = ['todo', 'in-progress', 'done'];

export function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [dragOverColumn, setDragOverColumn] = useState<ColumnType | null>(
        null
    );
    const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

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
            setIsAdding(false);
        },
        [tasks]
    );

    const handleTaskDrop = useCallback(
        (taskId: string, targetColumn: ColumnType) => {
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
        },
        []
    );

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

    const getTasksByColumn = useCallback(
        (column: ColumnType) =>
            tasks
                .filter((task) => task.column === column)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        [tasks]
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
            <AddTaskDialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setIsAdding(false);
                }}
                onSubmit={handleAddTask}
            />
        </div>
    );
}
