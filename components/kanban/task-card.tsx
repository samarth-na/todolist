"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "./types"
import { PRIORITY_CONFIG } from "./types"

interface TaskCardProps {
  task: Task
  onDragStart?: (taskId: string) => void
  onDragEnd?: () => void
  isDragging?: boolean
}

export function TaskCard({ task, onDragStart, onDragEnd, isDragging }: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority]

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", task.id)
    onDragStart?.(task.id)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      data-task-id={task.id}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 ease-out ${isDragging ? 'opacity-40' : ''}`}
    >
      <Card 
        className="border-zinc-300/40 dark:border-zinc-700/50 bg-white dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800/80 hover:border-zinc-300/60 dark:hover:border-zinc-600/60 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        style={{ transformOrigin: "center center" }}
      >
        <CardHeader className="p-2.5 pb-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
            <Badge className={`shrink-0 text-[10px] px-1.5 py-0 rounded-sm ${priorityConfig.className}`}>
              {priorityConfig.label}
            </Badge>
          </div>
        </CardHeader>
        {task.description && (
          <CardContent className="p-2.5 pt-1">
            <p className="text-xs text-muted-foreground/80 line-clamp-2">{task.description}</p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}