"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskCard } from "./task-card"
import type { Task, ColumnType } from "./types"
import { COLUMN_CONFIG } from "./types"

interface KanbanColumnProps {
  id: ColumnType
  tasks: Task[]
}

export function KanbanColumn({ id, tasks }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[id]

  return (
    <div className="flex flex-col min-w-0">
      <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-2 bg-background/95 backdrop-blur">
        <h2 className={`text-sm font-semibold ${config.color}`}>{config.title}</h2>
        <Badge variant="secondary" className="px-1.5 text-xs">
          {tasks.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}