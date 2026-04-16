'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Task, SubTask, Priority, ColumnType } from './types';
import { PRIORITY_CONFIG, COLUMN_CONFIG } from './types';
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Attachment01Icon } from "@hugeicons/core-free-icons";

interface TaskDetailDialogProps {
    task: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate?: (task: Partial<Task>) => void;
    onDelete?: () => void;
}

export function TaskDetailDialog({
    task,
    open,
    onOpenChange,
    onUpdate,
    onDelete,
}: TaskDetailDialogProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
    const [column, setColumn] = useState<ColumnType>(task?.column || 'todo');
    const [tags, setTags] = useState<string[]>(task?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours?.toString() || '');
    const [category, setCategory] = useState(task?.category || '');
    const [startDate, setStartDate] = useState(task?.startDate ? formatDateForInput(task.startDate) : '');
    const [dueDate, setDueDate] = useState(task?.dueDate ? formatDateForInput(task.dueDate) : '');
    const [subtasks, setSubtasks] = useState<SubTask[]>(task?.subtasks || []);
    const [newSubtask, setNewSubtask] = useState('');

    function formatDateForInput(date: Date): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    function formatDateDisplay(date: Date): string {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            setSubtasks([
                ...subtasks,
                { id: crypto.randomUUID(), title: newSubtask.trim(), done: false },
            ]);
            setNewSubtask('');
        }
    };

    const handleToggleSubtask = (id: string) => {
        setSubtasks(
            subtasks.map((st) =>
                st.id === id ? { ...st, done: !st.done } : st
            )
        );
    };

    const handleDeleteSubtask = (id: string) => {
        setSubtasks(subtasks.filter((st) => st.id !== id));
    };

    const handleSave = () => {
        if (onUpdate && task) {
            onUpdate({
                title,
                description: description || undefined,
                priority,
                column,
                tags: tags.length > 0 ? tags : undefined,
                estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
                category: category || undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                subtasks: subtasks.length > 0 ? subtasks : undefined,
            });
        }
        onOpenChange(false);
    };

    const completedSubtasks = subtasks.filter((st) => st.done).length;
    const totalSubtasks = subtasks.length;

    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Task Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                                value={priority}
                                onValueChange={(v) => setPriority(v as Priority)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            {config.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Column</Label>
                            <Select
                                value={column}
                                onValueChange={(v) => setColumn(v as ColumnType)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(COLUMN_CONFIG).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            {config.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">
                                Due Date
                            </Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="estimatedHours">
                                Est. Hours
                            </Label>
                            <Input
                                id="estimatedHours"
                                type="number"
                                min="0"
                                step="0.5"
                                value={estimatedHours}
                                onChange={(e) => setEstimatedHours(e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Category
                            </Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., Bug, Feature"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Tags
                        </Label>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Add a tag..."
                            />
                            <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                                Add
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Subtasks
                            {totalSubtasks > 0 && (
                                <span className="text-xs text-muted-foreground ml-1">
                                    ({completedSubtasks}/{totalSubtasks})
                                </span>
                            )}
                        </Label>
                        {subtasks.length > 0 && (
                            <div className="space-y-1 border rounded-md p-2 max-h-40 overflow-y-auto">
                                {subtasks.map((st) => (
                                    <div key={st.id} className="flex items-center gap-2 group">
                                        <Checkbox
                                            checked={st.done}
                                            onCheckedChange={() => handleToggleSubtask(st.id)}
                                        />
                                        <span className={st.done ? 'line-through text-muted-foreground' : ''}>
                                            {st.title}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSubtask(st.id)}
                                            className="ml-auto text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Input
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                                placeholder="Add a subtask..."
                            />
                            <Button type="button" variant="outline" size="sm" onClick={handleAddSubtask}>
                                Add
                            </Button>
                        </div>
                    </div>

                    {(task.assignee || task.attachments) && (
                        <div className="space-y-2 pt-2 border-t">
                            {task.assignee && (
                                <div className="flex items-center gap-2 text-sm">
                                    <HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Assigned to:</span>
                                    <span className="font-medium">{task.assignee.name}</span>
                                </div>
                            )}
                            {task.attachments && task.attachments.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <HugeiconsIcon icon={Attachment01Icon} className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Attachments:</span>
                                    <span className="font-medium">{task.attachments.length} files</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between pt-2 border-t">
                        {onDelete && (
                            <Button variant="destructive" size="sm" onClick={onDelete}>
                                Delete Task
                            </Button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
