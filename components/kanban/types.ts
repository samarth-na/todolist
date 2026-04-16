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
    category?: string[];
    tags?: string[];
}

export interface TaskInput {
    title: string;
    description?: string;
    priority: Priority;
    category?: string[];
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
        color: 'text-amber-600 dark:text-amber-400',
        accent: 'bg-amber-500/10 dark:bg-amber-500/20',
        border: 'border-amber-500/30 dark:border-amber-500/40',
        dragHighlight: 'bg-amber-500/15 dark:bg-amber-500/20 ring-1 ring-amber-400/30',
    },
    'in-progress': {
        title: 'In Progress',
        color: 'text-emerald-600 dark:text-emerald-400',
        accent: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        border: 'border-emerald-500/30 dark:border-emerald-500/40',
        dragHighlight: 'bg-emerald-500/15 dark:bg-emerald-500/20 ring-1 ring-emerald-400/30',
    },
    done: {
        title: 'Done',
        color: 'text-sky-500 dark:text-sky-400',
        accent: 'bg-sky-400/10 dark:bg-sky-400/20',
        border: 'border-sky-400/30 dark:border-sky-400/40',
        dragHighlight: 'bg-sky-400/15 dark:bg-sky-400/20 ring-1 ring-sky-400/30',
    },
};

export const PRIORITY_CONFIG: Record<
    Priority,
    { label: string; className: string; dot?: string }
> = {
    low: {
        label: 'Low',
        className: 'border-zinc-500/30 dark:border-zinc-500/40 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50',
    },
    medium: {
        label: 'Medium',
        className: 'border-amber-500/30 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    },
    high: {
        label: 'High',
        className:
            'border-orange-500/30 dark:border-orange-500/40 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    },
    urgent: {
        label: 'Urgent',
        className:
            'border-rose-500/30 dark:border-rose-500/40 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20',
        dot: 'bg-rose-500',
    },
};

