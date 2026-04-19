# Kanban UI Rewamp Plan

## Overview
Comprehensive redesign and fixes for the Kanban board to improve visual hierarchy, light/dark theme support, status indicators, task creation UX, task detail editing, and overall polish.

---

## 1. Light Theme Support (CRITICAL)

### Problem
All Kanban components use hardcoded `zinc-*` Tailwind colors that don't adapt to theme changes:
- `bg-zinc-950` → Always dark gray (breaks in light mode)
- `text-zinc-100`, `text-zinc-200` → Always near-white (breaks in light mode)
- `border-zinc-800/60` → Always dark border (breaks in light mode)

### Solution
Replace all hardcoded zinc colors with theme-aware CSS variables from `globals.css`:

| Hardcoded (Broken) | Theme-Aware (Fixed) |
|---------------------|---------------------|
| `bg-zinc-950` | `bg-background` |
| `bg-zinc-950/50` | `bg-background/50` or `bg-muted` |
| `bg-zinc-900/50` | `bg-muted` or `bg-card` |
| `bg-zinc-900/40` | `bg-muted/60` |
| `bg-zinc-900/60` | `bg-muted/80` |
| `bg-zinc-800/40` | `bg-secondary` or `bg-accent` |
| `bg-zinc-800/50` | `bg-secondary/70` |
| `bg-zinc-800/60` | `bg-secondary/80` |
| `text-zinc-100` | `text-foreground` |
| `text-zinc-200` | `text-foreground` or `text-primary` |
| `text-zinc-300` | `text-foreground/80` |
| `text-zinc-400` | `text-muted-foreground` |
| `text-zinc-500` | `text-muted-foreground/80` |
| `border-zinc-800/60` | `border-border` |
| `border-zinc-700/50` | `border-input` or `border-border/70` |

### Files to Update
- `components/kanban/board.tsx`
- `components/kanban/header.tsx`
- `components/kanban/column.tsx`
- `components/kanban/task-card.tsx`
- `components/kanban/inline-add.tsx`
- `components/kanban/drag-handle.tsx`
- `components/kanban/types.ts` (COLUMN_CONFIG)

### Column Accent Colors
- Stay the same hue in both themes (amber, emerald, sky)
- But use lighter opacity/weight in light theme:
  - **To Do dot**: `bg-amber-400` (light) / `bg-amber-500` (dark)
  - **In Progress dot**: `bg-emerald-400` (light) / `bg-emerald-500` (dark)
  - **Done dot**: `bg-sky-400` (light) / `bg-sky-500` (dark)
- Title text colors adapt similarly:
  - **To Do**: `text-amber-600` (light) / `text-amber-400` (dark)
  - **In Progress**: `text-emerald-600` (light) / `text-emerald-400` (dark)
  - **Done**: `text-sky-600` (light) / `text-sky-400` (dark)

---

## 2. Visual Hierarchy - Background Levels

### Structure
Create clear depth with three background levels:

| Level | Element | Light Theme | Dark Theme |
|-------|---------|-------------|------------|
| 1 (Deepest) | Page background | `bg-background` (white) | `bg-background` (near-black) |
| 2 (Mid) | Columns | `bg-muted` + `border-border` | `bg-muted` + `border-border` |
| 3 (Surface) | Task cards | `bg-card` + `border-input` | `bg-card` + `border-input` |
| 4 (Highest) | Inline add area | `bg-accent/50` | `bg-accent/50` |

### Implementation
- All backgrounds use CSS variables so they automatically adapt
- Different opacity levels create hierarchy without changing hue
- Cards should appear to "float" above columns

---

## 3. Status Lines with Visual Progress Bars

### Requirements
All three columns display progress bars with ratios.

### To Do Column
- **Label**: `To Do` with amber dot
- **Status line**: `{todoCount} / {totalTasks}` (e.g., "5 / 12")
- **Progress bar**: Amber-500 colored, width = `(todoCount / totalTasks) * 100%`
- **Location**: Below column header, above task list

### In Progress Column
- **Label**: `In Progress` with emerald dot
- **Status line**: `{inProgressCount} / {totalTasks}` (e.g., "3 / 12")
- **Progress bar**: Emerald-500 colored, width = `(inProgressCount / totalTasks) * 100%`
- **Location**: Below column header, above task list

### Done Column
- **Label**: `Done` with sky dot
- **Status line**: `{doneCount} / {totalTasks}` (e.g., "4 / 12")
- **Progress bar**: Sky-500 colored, width = `(doneCount / totalTasks) * 100%`
- **Location**: Below column header, above task list

### Progress Bar Styling
- Height: `h-0.5` (2px thin line)
- Background: `bg-border` (subtle, adapts to theme)
- Fill: Colored based on column type
- Rounded: `rounded-full`
- Margin: `mx-3` horizontal, `my-2` vertical
- Transition: `transition-all duration-300` for smooth updates

### Data Flow
- Board component passes `allTasks` array to each column
- Column calculates `todoCount`, `inProgressCount`, `doneCount`, `totalTasks`
- Column calculates progress percentages
- Pass this data to status display component

---

## 4. Uniform Padding & Borders

### Standardized Spacing System

#### Page Level
- Container: `px-4 md:px-8 lg:px-12 py-4 md:py-6`
- Ensures columns don't touch screen edges
- Responsive padding scales up on larger screens

#### Column Container
- Outer padding: `p-3` (12px)
- Border: `border border-border rounded-xl`
- Background: `bg-muted`

#### Column Header
- Padding: `px-3 py-2.5`
- Flex layout with gap-2 between elements
- Dot indicator + title + count aligned

#### Task List Area
- Padding: `p-3`
- Gap between cards: `gap-2`
- Scrollable if overflow: `overflow-y-auto flex-1`

#### Task Cards
- Padding: `p-3` (consistent with column)
- Border: `border border-input rounded-xl`
- Background: `bg-card`
- Min-height: `min-h-[80px]`
- Gap between internal elements: `gap-2`

#### Inline Add Area
- Padding: `p-2.5`
- Background: `bg-accent/50`
- Border: `border border-border rounded-lg`

### Border Consistency
| Element | Border | Radius |
|---------|--------|--------|
| Columns | `border-border` | `rounded-xl` |
| Task cards | `border-input` | `rounded-xl` |
| Inline add | `border-border` | `rounded-lg` |
| Priority badges | `border-transparent` | `rounded-full` |

---

## 5. Enhanced Inline Task Creation

### UX Flow
1. User sees "Add a task" button at bottom of each column
2. Clicking opens inline form with title input + quick options
3. "More options..." button opens full AddTaskDialog
4. Quick "Add" button creates task with minimal info

### Inline Form Layout
```
┌─────────────────────────────────────────┐
│ [Title input - placeholder: "Task..." ] │
│ [Priority ▼]        [More options...] [Add] │
└─────────────────────────────────────────┘
```

### Elements
- **Title Input**: `h-9 bg-background border-input rounded-lg`
- **Priority Select**: Compact dropdown, `h-8 rounded-md`
- **More Options Button**: Text button, opens AddTaskDialog with column pre-selected
- **Add Button**: Primary button `h-8`
- **Cancel**: Ghost button, hidden until input has content

### Keyboard Shortcuts
- `Enter`: Submit task
- `Escape`: Cancel and close form

### Default Priority
- Default to "medium" if not specified
- Remember last used priority (optional)

### Styling
- Use `bg-background` for input (stands out from column bg)
- Use `text-foreground` for input text
- Use `placeholder:text-muted-foreground` for placeholders

---

## 6. Task Detail/Edit Popup Modal

### Trigger
- Clicking on any task card opens this popup
- `onClick` handler on TaskCard component

### New Component: `task-detail-dialog.tsx`

### Layout (2-column on desktop)
```
┌─────────────────────────────────────────────────┐
│  Task Title                               [X]   │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────┐ ┌─────────────────┐  │
│  │ DESCRIPTION           │ │ PRIORITY        │  │
│  │ [textarea - editable] │ │ [select ▼]      │  │
│  │                       │ │                 │  │
│  │                       │ │ COLUMN          │  │
│  │                       │ │ [select ▼]      │  │
│  │                       │ │                 │  │
│  │                       │ │ DUE DATE        │  │
│  │                       │ │ [date picker]   │  │
│  │                       │ │                 │  │
│  │                       │ │ CATEGORIES      │  │
│  │                       │ │ [tag input]     │  │
│  │                       │ │ [tag] [tag]     │  │
│  │                       │ │                 │  │
│  │                       │ │ CREATED         │  │
│  │                       │ │ Jan 15, 2025    │  │
│  │                       │ │                 │  │
│  │                       │ │ COMPLETED       │  │
│  │                       │ │ Jan 16, 2025    │  │
│  │                       │ │ (or "-")        │  │
│  └───────────────────────┘ └─────────────────┘  │
├─────────────────────────────────────────────────┤
│  [Delete task]                   [Cancel] [Save]│
└─────────────────────────────────────────────────┘
```

### Dialog Styling
- Max width: `sm:max-w-[600px]`
- Use `bg-background` for dialog background
- `rounded-xl` border radius
- `border-border` for borders
- Same typography scale as rest of app

### Fields

#### Title
- Large text input or editable h3
- `text-lg font-semibold`
- Required field

#### Description
- Textarea with 4 rows default
- `text-sm` for content
- Optional
- Placeholder: "Add a description..."

#### Priority
- Select dropdown with options: Low, Medium, High, Urgent
- Colored badge display matching PRIORITY_CONFIG

#### Column
- Select dropdown: To Do, In Progress, Done
- Moving column updates task's column and order

#### Due Date
- Date picker input
- Shows formatted date (e.g., "Jan 15, 2025")
- Optional
- If overdue, show in orange/red

#### Categories
- Tag-style display with add/remove
- Input to add new category
- Badge display for existing categories
- Click X to remove

#### Created At
- Display only, not editable
- Formatted date string
- `text-muted-foreground`

#### Completed At
- Display only (auto-set when moved to Done)
- Shows date if completed, dash if not
- `text-muted-foreground`

### Actions

#### Save Button
- Primary button
- Saves all changes
- Closes dialog on success
- Shows loading state during save

#### Cancel Button
- Ghost/outline button
- Discards changes
- Closes dialog

#### Delete Button
- Destructive variant (red text or ghost with red)
- Shows confirmation dialog before deleting
- Confirmation: "Delete this task? This cannot be undone."
- On confirm: deletes task, closes dialog

### State Management
- Local state for form values (initialized from task prop)
- Compare with original on save to detect changes
- Optimistic update on save

### Props Interface
```typescript
interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: number, updates: Partial<TaskInput>) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}
```

---

## 7. Improved Header

### Current Issues
- Tight spacing
- Could use more visual structure
- Minimal information displayed

### Improvements

### Vertical Padding
- Increase from `py-3` to `py-4`
- Creates more breathing room

### Horizontal Layout
```
[Left Section]     [Center Section]          [Right Section]
Logo/Title         Search + Filters          User + Actions
```

### Left Section
- App title "Tasks" or custom branding
- `text-lg font-semibold`
- Optional: small icon/emoji

### Center Section (Search & Filters)
- Search input: larger, more prominent
  - `h-10` instead of `h-9`
  - Full min-width with `min-w-[200px]`
  - Max-width `max-w-sm`
- Priority filter dropdown
  - Compact but readable
  - Same height as search

### Right Section
- Task summary (optional): "12 tasks"
- Add Task button (primary)
- User info/name (hidden on mobile)
- Theme toggle button
- Logout button

### Spacing
- `gap-4` between major sections
- `gap-2` between related elements
- `ml-auto` pushes right section to end

### Sticky Behavior
- `sticky top-0 z-50`
- `backdrop-blur-sm` for slight blur effect
- `bg-background/80` for subtle background

### Mobile Responsiveness
- Hide user name on small screens
- Stack search and filters if needed
- Hamburger menu for additional options

---

## 8. Smaller Drag Handle

### Current
- 3 rows × 2 columns of dots
- Each dot: `h-1 w-1` (4px)
- Padding: `p-1` (4px)
- Gap between dots: `gap-[3px]`

### New
- 2 rows × 3 columns of dots
- Each dot: `h-0.5 w-0.5` (2px)
- Padding: `p-0.5` (2px)
- Gap between dots: `gap-[2px]`
- Total size: 8px × 6px (was 14px × 10px)

### File: `drag-handle.tsx`
```tsx
<div className="flex flex-col gap-[2px] cursor-grab active:cursor-grabbing p-0.5 -ml-0.5 rounded hover:bg-accent transition-colors">
  <div className="flex gap-[2px]">
    <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
    <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
    <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
  </div>
  <div className="flex gap-[2px]">
    <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
    <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
    <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
  </div>
</div>
```

### Color
- Use `bg-muted-foreground` for dots
- Lighter opacity (40-60%) so they're subtle
- Hover: slightly brighter

---

## 9. Card Sizing Consistency

### Standardized Task Card

#### Dimensions
- Min-height: `min-h-[80px]`
- Padding: `p-3` (12px)
- Border-radius: `rounded-xl`

#### Internal Layout
```
┌────────────────────────────────────────┐
│ [Drag] ┌────────────────────────────┐  │
│  Icon  │ Title           [Priority] │  │
│        │ Description               │  │
│        │               [Due Date]  │  │
│        └────────────────────────────┘  │
└────────────────────────────────────────┘
```

#### Typography
- Title: `text-sm font-medium`
- Description: `text-xs` with `line-clamp-2`
- Due date: `text-xs font-mono`
- Priority badge: `text-[10px]`

#### Flex Layout
- Horizontal flex with drag handle
- Drag handle: `shrink-0`
- Content: `flex-1 min-w-0`

#### Priority Badge
- Position: top-right corner
- `shrink-0` to prevent stretching
- Colored background per priority

#### Description
- `line-clamp-2` limits to 2 lines
- `text-muted-foreground` color
- Only show if description exists

#### Footer Area
- Always render flex container for alignment
- Due date on left
- Completed date on right (if done)
- Consistent spacing

---

## 10. Page Padding

### Current
```tsx
<main className="flex-1 p-4 md:p-6 overflow-x-auto">
```

### Updated
```tsx
<main className="flex-1 px-4 md:px-8 lg:px-12 py-4 md:py-6 overflow-x-auto">
```

### Responsive Breakdown
| Breakpoint | Horizontal Padding | Vertical Padding |
|------------|-------------------|------------------|
| Mobile (<768px) | 16px (px-4) | 16px (py-4) |
| Tablet (768px+) | 32px (px-8) | 24px (py-6) |
| Desktop (1024px+) | 48px (px-12) | 24px (py-6) |

### Max Width
- Keep `max-w-[1400px] mx-auto` on inner container
- Ensures readability on ultra-wide screens

---

## 11. Column Configuration Updates

### File: `components/kanban/types.ts`

### COLUMN_CONFIG Changes
Replace hardcoded zinc colors with theme-aware values:

```typescript
export const COLUMN_CONFIG: Record<ColumnType, {
  title: string;
  color: string;      // Text color class
  accent: string;      // Background accent
  border: string;      // Border class
  dragHighlight: string;  // Drag over highlight
  dot: string;         // Status dot color
}> = {
  todo: {
    title: "To Do",
    color: "text-amber-600 dark:text-amber-400",
    accent: "bg-amber-500/10",
    border: "border-border",
    dragHighlight: "bg-amber-500/20 ring-1 ring-amber-500/50",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  "in-progress": {
    title: "In Progress",
    color: "text-emerald-600 dark:text-emerald-400",
    accent: "bg-emerald-500/10",
    border: "border-border",
    dragHighlight: "bg-emerald-500/20 ring-1 ring-emerald-500/50",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  done: {
    title: "Done",
    color: "text-sky-600 dark:text-sky-400",
    accent: "bg-sky-500/10",
    border: "border-border",
    dragHighlight: "bg-sky-500/20 ring-1 ring-sky-500/50",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
};
```

### Key Changes
- Title colors: Light theme uses darker shade (amber-600 vs amber-400)
- Dot colors: Same pattern
- Borders: All use `border-border` (adapts to theme)
- Accent backgrounds: Colored with low opacity

---

## 12. Board Component Updates

### File: `components/kanban/board.tsx`

### Changes
1. Update page padding to `px-4 md:px-8 lg:px-12`
2. Pass `allTasks` to each KanbanColumn for calculating counts
3. State for selected task (for detail popup)
4. TaskDetailDialog component integration

### Updated Props to KanbanColumn
```typescript
<KanbanColumn
  key={column}
  id={column}
  tasks={getTasksByColumn(column)}
  allTasks={filteredTasks}  // NEW: for count calculations
  totalTaskCount={filteredTasks.length}  // NEW: for progress bar
  // ... existing props
/>
```

---

## 13. Column Component Updates

### File: `components/kanban/column.tsx`

### New Props
```typescript
interface KanbanColumnProps {
  // ... existing props
  allTasks?: Task[];  // For calculating counts
  totalTaskCount?: number;  // Alternative to passing allTasks
}
```

### Status Line Implementation
Below the header, above the task list:

```tsx
{/* Status bar */}
<div className="px-3 py-2">
  <div className="flex items-center justify-between mb-1.5">
    <span className="text-xs font-mono text-muted-foreground">
      {columnCount} / {totalTaskCount}
    </span>
    <span className="text-xs font-mono text-muted-foreground">
      {Math.round((columnCount / totalTaskCount) * 100)}%
    </span>
  </div>
  <div className="h-0.5 w-full bg-border rounded-full overflow-hidden">
    <div
      className={`h-full ${progressColor} transition-all duration-300`}
      style={{ width: `${(columnCount / totalTaskCount) * 100}%` }}
    />
  </div>
</div>
```

### Dynamic Background
```tsx
<div
  className={`flex flex-col min-w-0 rounded-xl border ${config.border} bg-muted`}
>
```

### Progress Bar Colors
| Column | Light Theme | Dark Theme |
|--------|-------------|------------|
| To Do | `bg-amber-500` | `bg-amber-400` |
| In Progress | `bg-emerald-500` | `bg-emerald-400` |
| Done | `bg-sky-500` | `bg-sky-400` |

---

## 14. Inline Add Component Updates

### File: `components/kanban/inline-add.tsx`

### New Props
```typescript
interface InlineAddProps {
  column: ColumnType;
  onAdd: (input: TaskInput, column: ColumnType) => void;
  onOpenFullDialog?: () => void;  // NEW: opens full dialog
  defaultPriority?: Priority;
}
```

### Layout Changes
```tsx
return (
  <div className="rounded-lg border border-border bg-accent/50 p-3 space-y-2">
    <Input
      ref={inputRef}
      placeholder="Task title..."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={handleKeyDown}
      className="h-9 bg-background border-input"
    />
    <div className="flex items-center gap-2">
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
      >
        {/* options */}
      </select>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 text-xs text-muted-foreground"
        onClick={onOpenFullDialog}
      >
        More options...
      </Button>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        size="sm"
        className="h-8 text-xs"
        onClick={handleSubmit}
        disabled={!title.trim()}
      >
        Add
      </Button>
    </div>
  </div>
);
```

### Parent Integration
In `column.tsx`:
```tsx
<InlineAdd
  column={id}
  onAdd={onAddTask}
  onOpenFullDialog={() => onOpenAddDialog?.(id)}
/>
```

---

## 15. Task Card Component Updates

### File: `components/kanban/task-card.tsx`

### Updates
1. Add `onClick` prop to trigger detail popup
2. Update background colors to use CSS variables
3. Ensure consistent sizing

```tsx
<div
  draggable
  onDragStart={handleDragStart}
  onDragEnd={onDragEnd}
  onClick={() => onClick?.(task)}
  onKeyDown={(e) => e.key === "Enter" && onClick?.(task)}
  role="button"
  tabIndex={0}
  data-task-id={task.id}
  className={`
    min-h-[80px] rounded-xl border border-input bg-card p-3
    transition-all duration-200
    ${isDragging ? "opacity-40 scale-[0.98]" : ""}
    ${isDone ? "opacity-70" : ""}
  `}
>
```

---

## 16. Header Component Updates

### File: `components/kanban/header.tsx`

### Updates
1. Increase vertical padding to `py-4`
2. Improve spacing with `gap-4`
3. Larger search input `h-10`
4. Better organized layout

```tsx
<header className="
  flex items-center gap-4 px-4 md:px-6 py-4
  border-b border-border
  bg-background/80 backdrop-blur-sm
  sticky top-0 z-50
">
  {/* Title */}
  <h1 className="text-lg font-semibold shrink-0">{title}</h1>

  {/* Search & Filters - Center */}
  <div className="flex items-center gap-3 flex-1 max-w-xl">
    {/* Search input - larger */}
    <div className="relative flex-1">
      <Input
        className="h-10 pl-10 pr-4 bg-background border-input"
        {/* ... */}
      />
    </div>

    {/* Priority filter */}
    <select className="h-10 rounded-lg border border-input bg-background px-3">
      {/* options */}
    </select>
  </div>

  {/* Right Section */}
  <div className="flex items-center gap-3 ml-auto">
    {/* Task count (optional) */}
    <span className="text-sm text-muted-foreground hidden md:block">
      {taskCount} tasks
    </span>

    {/* Add button */}
    <Button size="sm" className="h-10">
      {/* */}
    </Button>

    {/* User info */}
    {session && (
      <span className="text-sm hidden lg:block">
        {session.user.name}
      </span>
    )}

    {/* Theme toggle */}
    <Button variant="ghost" size="icon" className="h-10 w-10">
      {/* theme toggle */}
    </Button>

    {/* Logout */}
    {session && (
      <Button variant="ghost" size="sm">
        Logout
      </Button>
    )}
  </div>
</header>
```

---

## Implementation Order

1. **types.ts** - Update COLUMN_CONFIG with theme-aware colors
2. **board.tsx** - Page padding, pass task counts to columns, add dialog state
3. **column.tsx** - Status lines with progress bars, background hierarchy, uniform padding
4. **task-card.tsx** - Theme-aware colors, card sizing, click handler
5. **drag-handle.tsx** - Smaller icon
6. **inline-add.tsx** - More options button integration
7. **header.tsx** - Improved spacing and detail
8. **task-detail-dialog.tsx** - New component for task editing
9. **Verify light/dark theme** - Test both modes
10. **Polish pass** - Final adjustments

---

## Testing Checklist

### Light Theme
- [ ] Page background is white/light
- [ ] Header has proper contrast
- [ ] Columns have visible borders on light background
- [ ] Task cards stand out from column background
- [ ] Text is readable (dark text on light backgrounds)
- [ ] Priority badges have proper colors
- [ ] Status progress bars are visible
- [ ] All buttons and interactive elements work

### Dark Theme
- [ ] Page background is dark
- [ ] Header has proper contrast
- [ ] Columns have visible borders on dark background
- [ ] Task cards stand out from column background
- [ ] Text is readable (light text on dark backgrounds)
- [ ] All elements match current dark theme behavior

### Functionality
- [ ] Drag and drop works
- [ ] Inline task creation works
- [ ] "More options" opens full dialog
- [ ] Clicking task opens detail popup
- [ ] Editing task in popup saves correctly
- [ ] Deleting task from popup works
- [ ] Status lines show correct counts
- [ ] Progress bars animate correctly

### Responsive
- [ ] Mobile: Full-width columns with horizontal scroll
- [ ] Tablet: Comfortable spacing
- [ ] Desktop: Optimal use of space with max-width
- [ ] Header adapts to screen size

---

## File Summary

| File | Changes |
|------|---------|
| `components/kanban/types.ts` | Theme-aware COLUMN_CONFIG |
| `components/kanban/board.tsx` | Padding, task counts, dialog state |
| `components/kanban/column.tsx` | Status lines, progress bars, hierarchy |
| `components/kanban/task-card.tsx` | Theme colors, sizing, click handler |
| `components/kanban/drag-handle.tsx` | Smaller dots |
| `components/kanban/inline-add.tsx` | More options button |
| `components/kanban/header.tsx` | Better spacing |
| `components/kanban/task-detail-dialog.tsx` | **NEW FILE** - Task editing popup |

---

## Todo List

- [ ] Update COLUMN_CONFIG in types.ts with theme-aware colors
- [ ] Fix board.tsx page padding and pass task counts to columns
- [ ] Implement status lines with progress bars in column.tsx
- [ ] Add visual hierarchy with proper background levels in column.tsx
- [ ] Apply uniform padding and borders throughout column.tsx
- [ ] Update task-card.tsx with theme-aware colors and consistent sizing
- [ ] Make drag handle icon smaller in drag-handle.tsx
- [ ] Add "More options" button to inline-add.tsx
- [ ] Improve header spacing and detail in header.tsx
- [ ] Create new task-detail-dialog.tsx component
- [ ] Integrate task detail popup into board.tsx
- [ ] Test light theme and fix any remaining issues
- [ ] Test dark theme to ensure no regressions
- [ ] Verify responsive behavior on mobile/tablet/desktop
- [ ] Test drag and drop functionality
- [ ] Test inline task creation flow
- [ ] Test task editing and deletion
- [ ] Run lint check with `bun run lint`
