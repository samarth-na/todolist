"use client"

import { Button } from "@/components/ui/button"

interface KanbanHeaderProps {
  title?: string
  onAddClick?: () => void
}

export function KanbanHeader({ title = "Tasks", onAddClick }: KanbanHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/60">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        {onAddClick && (
          <Button size="sm" onClick={onAddClick}>
            Add Task
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </Button>
      </div>
    </header>
  )
}