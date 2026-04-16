"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

interface KanbanHeaderProps {
  title?: string
  onAddClick?: () => void
}

export function KanbanHeader({ title = "Tasks", onAddClick }: KanbanHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <h1 className="text-base font-medium tracking-tight">{title}</h1>
      <div className="flex items-center gap-1.5">
        {onAddClick && (
          <Button size="sm" className="h-8 text-xs" onClick={onAddClick}>
            Add Task
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground h-8 w-8 hover:text-foreground transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-0 transition-transform duration-300">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-0 transition-transform duration-300">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </Button>
      </div>
    </header>
  )
}