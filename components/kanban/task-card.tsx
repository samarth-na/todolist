"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "./types"
import { PRIORITY_CONFIG } from "./types"

interface TaskCardProps {
  task: Task
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function TaskCard({ task, onDragStart, onDragEnd }: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority]

  return (
    <Card className="group cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-3 pb-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
          <Badge variant={priorityConfig.variant} className="shrink-0 text-[10px] px-1.5 py-0">
            {priorityConfig.label}
          </Badge>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="p-3 pt-1">
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        </CardContent>
      )}
    </Card>
  )
}