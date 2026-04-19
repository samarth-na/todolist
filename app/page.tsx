import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTasks, getCategories } from "./actions";
import { KanbanBoard } from "@/components/kanban/board";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight">TaskFlow</h1>
          <p className="text-muted-foreground text-lg">
            Organize your tasks with a simple kanban board. Track progress, set priorities, and stay productive.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initialTasks = await getTasks();
  const initialCategories = await getCategories();

  return (
    <KanbanBoard
      initialTasks={initialTasks}
      initialCategories={initialCategories.map((c) => c.name)}
    />
  );
}
