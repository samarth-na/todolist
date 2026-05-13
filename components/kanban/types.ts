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
    title: "To do",
    color: "text-zinc-400",
    accent: "bg-zinc-500/10",
    border: "border-border",
    dragHighlight: "bg-zinc-500/20 ring-1 ring-zinc-500/50",
    dot: "bg-zinc-500",
  },
  "in-progress": {
    title: "In progress",
    color: "text-emerald-500",
    accent: "bg-emerald-500/10",
    border: "border-border",
    dragHighlight: "bg-emerald-500/20 ring-1 ring-emerald-500/50",
    dot: "bg-emerald-500",
  },
  done: {
    title: "Done",
    color: "text-blue-500",
    accent: "bg-blue-500/10",
    border: "border-border",
    dragHighlight: "bg-blue-500/20 ring-1 ring-blue-500/50",
    dot: "bg-blue-500",
  },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> =
  {
    low: {
      label: "Low",
      className: "bg-zinc-500/20 text-zinc-400",
    },
    medium: {
      label: "Medium",
      className: "bg-amber-500/20 text-amber-500",
    },
    high: {
      label: "High",
      className: "bg-orange-500/20 text-orange-500",
    },
    urgent: {
      label: "Urgent",
      className: "bg-rose-500/20 text-rose-500",
    },
  };
