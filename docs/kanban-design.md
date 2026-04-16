# Kanban Todo App - Component Design

## 1. Board Layout (KanbanBoard)

**File**: `components/kanban/board.tsx`

**Props**:
```tsx
interface KanbanBoardProps {
  initialTasks?: Task[]
}
```

**Responsibility**:
- Holds the 3-column grid layout
- Manages global task state (CRUD)
- Handles drag-drop context and logic
- Passes task updates to columns

**State Ownership**:
- Tasks array (owned here)
- `addTask(column: ColumnType, task: Task)`
- `updateTask(id: string, updates: Partial<Task>)`
- `deleteTask(id: string)`
- `moveTask(id: string, to: ColumnType)`

---

## 2. Column Component (KanbanColumn)

**File**: `components/kanban/column.tsx`

**Props**:
```tsx
interface KanbanColumnProps {
  id: ColumnType
  title: string
  tasks: Task[]
  onAddTask: () => void
  onMoveTask: (taskId: string) => void
}
```

**Responsibility**:
- Renders column header with count badge
- Renders filtered task Cards
- Passes drag events to Board

**State Ownership**:
- Receives filtered task list from Board (not owned)

---

## 3. Card Component (TaskCard)

**File**: `components/kanban/task-card.tsx`

**Props**:
```tsx
interface TaskCardProps {
  task: Task
  onDragStart: () => void
  onDragEnd: () => void
}
```

**Responsibility**:
- Displays title, description, priority badge
- Handles individual drag handle
- Click to edit (opens dialog)

**State Ownership**:
- None (stateless, receives data via props)

---

## 4. Add Task Dialog (AddTaskDialog)

**File**: `components/kanban/add-task-dialog.tsx`

**Props**:
```tsx
interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultColumn?: ColumnType
  onSubmit: (task: TaskInput) => void
}
```

**Responsibility**:
- Form: title (required), description, priority
- Validates inputs
- Calls onSubmit with form data

**State Ownership**:
- Local form state (Title, Description, Priority)

---

## 5. Header / Toolbar (KanbanHeader)

**File**: `components/kanban/header.tsx`

**Props**:
```tsx
interface KanbanHeaderProps {
  title?: string
  onAddClick?: () => void
}
```

**Responsibility**:
- App title/logo
- Global "Add Task" button (optional)
- Empty - minimal

**State Ownership**: None

---

## Shared Types

**File**: `components/kanban/types.ts`

```tsx
type ColumnType = 'todo' | 'in-progress' | 'done'

type Priority = 'low' | 'medium' | 'high' | 'urgent'

interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  column: ColumnType
  createdAt: Date
}

interface TaskInput {
  title: string
  description?: string
  priority: Priority
}
```

---

## UX Decisions

| Decision | Rationale |
|---------|---------|
| Board owns all state | Simpler for dnd-kit; columns are dumb display |
| Dialog for add/edit | Cleaner than inline forms |
| Priority as select in dialog | Not many options; simple form |
| Card click → edit | Familiar pattern (Linear-style) |
| Sticky column headers | Always visible while scrolling |
| Cards in column scroll | Independent column scrolling |
| Count badge in header | Shows filtered list size |

---

## Component Hierarchy

```
KanbanBoard
├── KanbanHeader
├── Dialog (AddTaskDialog) ← Portal
└── 3x KanbanColumn
    └── 3x TaskCard
```