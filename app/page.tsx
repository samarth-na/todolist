import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTasks, getCategories } from "./actions";
import { KanbanBoard } from "@/components/kanban/board";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
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
