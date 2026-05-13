"use client";

import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ColumnType, TaskInput, Priority } from "./types";

interface InlineAddProps {
  column: ColumnType;
  onAdd: (input: TaskInput, column: ColumnType) => void;
  onOpenFullDialog?: () => void;
  defaultPriority?: Priority;
}

export function InlineAdd({ column, onAdd, onOpenFullDialog, defaultPriority = "medium" }: InlineAddProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority }, column);
    setTitle("");
    setPriority("medium");
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setPriority("medium");
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        className="w-full h-9 text-muted-foreground hover:text-foreground text-sm justify-start px-3 rounded-lg border-border/50"
        onClick={() => setIsExpanded(true)}
      >
        <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
        Add a task
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-border/40 bg-card p-3 space-y-2.5">
      <Input
        ref={inputRef}
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-9 bg-background border-input text-sm rounded-md"
      />
      <div className="flex items-center gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        {onOpenFullDialog && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground px-2.5"
            onClick={onOpenFullDialog}
          >
            More...
          </Button>
        )}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-md"
          onClick={handleCancel}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs px-3 rounded-md"
          onClick={handleSubmit}
          disabled={!title.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}