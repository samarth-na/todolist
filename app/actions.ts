"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { tasks, categories, taskCategories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type TaskWithCategories = {
  id: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  column: "todo" | "in-progress" | "done";
  order: number;
  createdAt: Date;
  category: string[];
};

export async function getTasks(): Promise<TaskWithCategories[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const tasksData = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      priority: tasks.priority,
      column: tasks.column,
      order: tasks.order,
      createdAt: tasks.createdAt,
    })
    .from(tasks)
    .where(eq(tasks.userId, session.user.id))
    .orderBy(tasks.order);

  const taskCats = await db
    .select({
      taskId: taskCategories.taskId,
      name: categories.name,
    })
    .from(taskCategories)
    .innerJoin(categories, eq(taskCategories.categoryId, categories.id));

  const categoryMap = new Map<number, string[]>();
  for (const tc of taskCats) {
    const existing = categoryMap.get(tc.taskId) || [];
    existing.push(tc.name);
    categoryMap.set(tc.taskId, existing);
  }

  return tasksData.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? undefined,
    priority: t.priority,
    column: t.column,
    order: t.order,
    createdAt: t.createdAt,
    category: categoryMap.get(t.id) || [],
  }));
}

export async function getCategories(): Promise<{ id: number; name: string }[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .where(eq(categories.userId, session.user.id))
    .orderBy(categories.name);
}

interface AddTaskInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  category?: string[];
}

export async function addTask(input: AddTaskInput, column: "todo" | "in-progress" | "done") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const columnTasks = await db
    .select({ id: tasks.id })
    .from(tasks)
    .where(and(eq(tasks.column, column), eq(tasks.userId, session.user.id)));
  const newOrder = columnTasks.length;

  const [newTask] = await db
    .insert(tasks)
    .values({
      title: input.title,
      description: input.description,
      priority: input.priority,
      column,
      order: newOrder,
      userId: session.user.id,
    })
    .returning();

  if (input.category && input.category.length > 0) {
    for (const catName of input.category) {
      let [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(and(eq(categories.name, catName), eq(categories.userId, session.user.id)));

      if (!category) {
        [category] = await db
          .insert(categories)
          .values({ name: catName, userId: session.user.id })
          .returning();
      }

      await db.insert(taskCategories).values({
        taskId: newTask.id,
        categoryId: category.id,
      });
    }
  }

  return { ...newTask, category: input.category || [] };
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  column?: "todo" | "in-progress" | "done";
  order?: number;
}

export async function updateTask(id: number, input: UpdateTaskInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .update(tasks)
    .set(input)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));
}

export async function deleteTask(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db.delete(taskCategories).where(eq(taskCategories.taskId, id));
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));
}

export async function addCategory(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.name, name), eq(categories.userId, session.user.id)));

  if (existing.length > 0) {
    return existing[0];
  }

  const [category] = await db
    .insert(categories)
    .values({ name, userId: session.user.id })
    .returning();

  return category;
}
