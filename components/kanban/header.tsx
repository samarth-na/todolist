"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSession, signOut } from "@/lib/auth-client"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Add01Icon, MoonIcon, Sun02Icon, LogoutCircle01Icon, UserIcon } from "@hugeicons/core-free-icons"
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
    <header className="flex items-center gap-4 py-4">
      {/* Brand / Title */}
      <div className="flex items-center shrink-0">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h1>
      </div>

      {/* Search - separate from Filter button */}
      {showSearch && (
        <div className="relative max-w-[240px] min-w-0 group">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground"
          />
          <Input
            placeholder="Search tasks..."
            className="h-9 pl-10 pr-3 bg-transparent border-border text-sm focus-visible:ring-0 focus-visible:border-ring"
            value={filters?.search ?? ""}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      )}

      {/* Filter button - separate from search */}
      {showSearch && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 border-border/50"
          onClick={() => {
            const priorities: (Priority | "all")[] = ["all", "low", "medium", "high", "urgent"];
            const currentIndex = priorities.indexOf(filters?.priority ?? "all");
            const nextIndex = (currentIndex + 1) % priorities.length;
            handlePriorityChange(priorities[nextIndex]);
          }}
        >
          Filter
          {filters?.priority && filters.priority !== "all" && (
            <span className="ml-2 text-xs text-muted-foreground">
              {filters.priority}
            </span>
          )}
        </Button>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* User avatar with logout popover */}
        {session && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full p-0 hover:bg-muted/50"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <HugeiconsIcon 
                    icon={UserIcon} 
                    size={16} 
                    className="text-primary" 
                  />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <HugeiconsIcon icon={LogoutCircle01Icon} size={16} />
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <HugeiconsIcon icon={Sun02Icon} size={16} />
          ) : (
            <HugeiconsIcon icon={MoonIcon} size={16} />
          )}
        </Button>
        
        {/* Add task button */}
        {onAddClick && (
          <Button 
            variant="outline"
            size="sm" 
            className="h-9 px-5 text-sm font-medium border-border/50" 
            onClick={onAddClick}
          >
            <HugeiconsIcon icon={Add01Icon} size={18} className="mr-2" />
            Add task
          </Button>
        )}
      </div>
    </header>
  )
}
