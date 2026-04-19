"use client";

interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className = "" }: DragHandleProps) {
  return (
    <div
      className={`flex flex-col gap-[2px] cursor-grab active:cursor-grabbing p-0.5 -ml-0.5 rounded hover:bg-accent transition-colors ${className}`}
      title="Drag to move"
    >
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
  );
}