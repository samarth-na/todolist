"use client"

import { Badge } from "@/components/ui/badge"
import type { Task } from "./types"
import { PRIORITY_CONFIG } from "./types"

interface TaskCardProps {
  task: Task
  onDragStart?: (taskId: string) => void
  onDragEnd?: () => void
  isDragging?: boolean
  onClick?: (task: Task) => void
}

export function TaskCard({ task, onDragStart, onDragEnd, isDragging, onClick }: TaskCardProps) {
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
      onClick={() => onClick?.(task)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(task)}
      role="button"
      tabIndex={0}
      data-task-id={task.id}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 ease-out touch-drag-handle ${isDragging ? 'opacity-40 scale-[0.98]' : ''}`}
    >
      <div 
        className="rounded-lg border border-zinc-300/40 dark:border-zinc-700/50 bg-white dark:bg-zinc-900/60 p-3 space-y-2 hover:bg-white dark:hover:bg-zinc-800/80 hover:border-zinc-300/60 dark:hover:border-zinc-600/60 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        style={{ transformOrigin: "center center" }}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium leading-normal">{task.title}</h3>
          <Badge className={`shrink-0 text-[10px] px-1.5 py-0 rounded-sm ${priorityConfig.className}`}>
            {priorityConfig.label}
          </Badge>
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">{task.description}</p>
        )}
      </div>
    </div>
  )
}