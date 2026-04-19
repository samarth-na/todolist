export type ColumnType = "todo" | "in-progress" | "done";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  column: ColumnType;
  createdAt: Date;
  order?: number;
  category?: string[];
  tags?: string[];
  dueDate?: Date;
  completedAt?: Date;
}

export interface TaskInput {
  title: string;
  description?: string;
  priority: Priority;
  category?: string[];
  dueDate?: Date;
}

export interface FilterState {
  search: string;
  priority: Priority | "all";
}

export const COLUMN_CONFIG: Record<
  ColumnType,
  {
    title: string;
    color: string;
    accent: string;
    border: string;
    dragHighlight: string;
    dot: string;
  }
> = {
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

export const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> =
  {
    low: {
      label: "Low",
      className: "bg-secondary text-secondary-foreground",
    },
    medium: {
      label: "Medium",
      className: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    },
    high: {
      label: "High",
      className: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
    },
    urgent: {
      label: "Urgent",
      className: "bg-rose-500/20 text-rose-600 dark:text-rose-400",
    },
  };
