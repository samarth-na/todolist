"use client"

import { Badge } from "@/components/ui/badge"
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
    <div className="flex flex-col min-w-0 rounded-lg h-full transition-colors duration-200">
      <div className={`sticky top-0 z-10 flex items-center gap-2 px-3 py-2.5 ${config.accent} rounded-t-lg border-b border-border/30`}>
        <h2 className={`text-sm font-medium ${config.color}`}>{config.title}</h2>
        <Badge variant="secondary" className="px-1.5 text-[10px] font-normal">
          {tasks.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-2 p-2.5 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-xs text-muted-foreground/50">
            <span>No tasks</span>
            <span className="text-[10px] mt-1 opacity-60">Drop one to get started</span>
          </div>
        )}
      </div>
    </div>
  )
}