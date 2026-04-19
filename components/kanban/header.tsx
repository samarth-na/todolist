"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession, signOut } from "@/lib/auth-client"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Add01Icon, MoonIcon, Sun02Icon } from "@hugeicons/core-free-icons"
import type { Priority, FilterState } from "./types"

interface KanbanHeaderProps {
  title?: string
  onAddClick?: () => void
  filters?: FilterState
  onFiltersChange?: (filters: FilterState) => void
  showSearch?: boolean
  taskCount?: number
}

export function KanbanHeader({
  title = "Tasks",
  onAddClick,
  filters,
  onFiltersChange,
  showSearch = true,
  taskCount
}: KanbanHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/login"
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange?.({ ...filters!, search })
  }

  const handlePriorityChange = (priority: Priority | "all") => {
    onFiltersChange?.({ ...filters!, priority })
  }

  return (
    <header className="flex items-center gap-4 px-4 md:px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <h1 className="text-lg font-semibold tracking-tight shrink-0">{title}</h1>

      {showSearch && (
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search tasks..."
              className="h-10 pl-10 pr-4 bg-background border-input"
              value={filters?.search ?? ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <select
            value={filters?.priority ?? "all"}
            onChange={(e) => handlePriorityChange(e.target.value as Priority | "all")}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-3 ml-auto">
        {taskCount !== undefined && (
          <span className="text-sm text-muted-foreground hidden md:block">
            {taskCount} tasks
          </span>
        )}
        {onAddClick && (
          <Button size="sm" className="h-10" onClick={onAddClick}>
            <HugeiconsIcon icon={Add01Icon} size={16} className="mr-1.5" />
            Add task
          </Button>
        )}
        {session && (
          <span className="text-sm hidden lg:block">
            {session.user.name}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <HugeiconsIcon icon={Sun02Icon} width={16} height={16} />
          ) : (
            <HugeiconsIcon icon={MoonIcon} width={16} height={16} />
          )}
        </Button>
        {session && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  )
}