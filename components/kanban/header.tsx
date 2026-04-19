"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <header className="flex items-center gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6 lg:px-8 py-3.5 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      {/* Brand / Title */}
      <div className="flex items-center shrink-0">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h1>
      </div>

      {/* Search - separate from Filter button */}
      {showSearch && (
        <div className="relative max-w-[280px] sm:max-w-[320px] min-w-0 group">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground"
          />
          <Input
            placeholder="Search tasks..."
            className="h-10 pl-10 pr-3 bg-background border-input text-sm transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
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
          className="h-10 px-4 border-border/50"
          onClick={() => {
            // Cycle through priority filters
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

      {/* Actions - separated from filters, tight internal grouping */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto pl-4 sm:pl-8 border-l border-border/50">
        {onAddClick && (
          <Button 
            size="sm" 
            className="h-10 px-5 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200" 
            onClick={onAddClick}
          >
            <HugeiconsIcon icon={Add01Icon} size={18} className="mr-2" />
            Add task
          </Button>
        )}
        
        {/* User section - only show on larger screens */}
        {session && (
          <div className="hidden lg:flex items-center gap-2.5 pl-3 sm:pl-4 border-l border-border/50">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon 
                icon={UserIcon} 
                size={16} 
                className="text-primary" 
              />
            </div>
            <span className="text-sm font-medium max-w-[140px] truncate">
              {session.user.name}
            </span>
          </div>
        )}
        
        {/* Utility actions - icon-only group */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 transition-transform hover:scale-105"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <HugeiconsIcon icon={Sun02Icon} size={16} className="transition-transform" />
            ) : (
              <HugeiconsIcon icon={MoonIcon} size={16} className="transition-transform" />
            )}
          </Button>
          
          {session && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive transition-all duration-200"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <HugeiconsIcon icon={LogoutCircle01Icon} size={16} />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}