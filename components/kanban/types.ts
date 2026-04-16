export type ColumnType = 'todo' | 'in-progress' | 'done';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    column: ColumnType;
    createdAt: Date;
    order?: number;
}

export interface TaskInput {
    title: string;
    description?: string;
    priority: Priority;
}

export const COLUMN_CONFIG: Record<
    ColumnType,
    {
        title: string;
        color: string;
        accent: string;
        border: string;
        dragHighlight: string;
    }
> = {
    todo: {
        title: 'To Do',
        color: 'text-muted-foreground',
        accent: 'bg-zinc-400/30',
        border: 'border-zinc-400/70',
        dragHighlight: 'bg-zinc-200/20 ring-2 ring-zinc-400/50',
    },
    'in-progress': {
        title: 'In Progress',
        color: 'text-amber-700 dark:text-amber-400',
        accent: 'bg-amber-500/20',
        border: 'border-amber-500/60',
        dragHighlight: 'bg-amber-200/20 ring-2 ring-amber-500/50',
    },
    done: {
        title: 'Done',
        color: 'text-emerald-700 dark:text-emerald-400',
        accent: 'bg-emerald-500/20',
        border: 'border-emerald-500/60',
        dragHighlight: 'bg-emerald-200/20 ring-2 ring-emerald-500/50',
    },
};

export const PRIORITY_CONFIG: Record<
    Priority,
    { label: string; className: string; dot?: string }
> = {
    low: {
        label: 'Low',
        className: 'border-border/50 text-muted-foreground/60 bg-transparent',
    },
    medium: {
        label: 'Medium',
        className: 'border-border/70 text-muted-foreground/80 bg-transparent',
    },
    high: {
        label: 'High',
        className:
            'border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10',
    },
    urgent: {
        label: 'Urgent',
        className:
            'border-rose-500/40 text-rose-700 dark:text-rose-300 bg-rose-500/10',
        dot: 'bg-rose-500',
    },
};

