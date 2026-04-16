"use client"

import { useState, useCallback } from "react"
import { KanbanHeader } from "./header"
import { KanbanColumn } from "./column"
import { AddTaskDialog } from "./add-task-dialog"
import type { Task, TaskInput, ColumnType } from "./types"

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Design system architecture",
    description: "Define the component hierarchy and data flow patterns for the application",
    priority: "high",
    column: "todo",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Set up authentication",
    description: "Implement OAuth login with Google and GitHub providers",
    priority: "urgent",
    column: "in-progress",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Write documentation",
    priority: "medium",
    column: "todo",
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Fix navigation bug",
    description: "User reported that the sidebar doesn't collapse on mobile",
    priority: "low",
    column: "done",
    createdAt: new Date(),
  },
]

const COLUMNS: ColumnType[] = ["todo", "in-progress", "done"]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTask = useCallback((input: TaskInput, column: ColumnType) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...input,
      column,
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
    setIsAdding(false)
  }, [])

  const getTasksByColumn = useCallback(
    (column: ColumnType) => tasks.filter((task) => task.column === column),
    [tasks]
  )

  return (
    <div className="flex flex-col h-screen">
      <KanbanHeader onAddClick={() => setDialogOpen(true)} />
      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        <div className="max-w-[1200px] mx-auto h-full">
          <div className="grid grid-cols-3 gap-4 md:gap-6 min-w-[800px] h-full">
            {COLUMNS.map((column) => (
              <KanbanColumn key={column} id={column} tasks={getTasksByColumn(column)} />
            ))}
          </div>
        </div>
      </main>
      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setIsAdding(false)
        }}
        onSubmit={handleAddTask}
      />
    </div>
  )
}