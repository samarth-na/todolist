export type ColumnType = 'todo' | 'in-progress' | 'done'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  column: ColumnType
  createdAt: Date
}

export interface TaskInput {
  title: string
  description?: string
  priority: Priority
}

export const COLUMN_CONFIG: Record<ColumnType, { title: string; color: string }> = {
  'todo': { title: 'To Do', color: 'text-muted-foreground' },
  'in-progress': { title: 'In Progress', color: 'text-blue-600' },
  'done': { title: 'Done', color: 'text-emerald-600' },
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; variant: 'secondary' | 'outline' | 'default' | 'destructive' }> = {
  'low': { label: 'Low', variant: 'secondary' },
  'medium': { label: 'Medium', variant: 'outline' },
  'high': { label: 'High', variant: 'default' },
  'urgent': { label: 'Urgent', variant: 'destructive' },
}