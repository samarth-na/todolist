// lib/db/schema.ts
import { text, integer, sqliteTable, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  token: text("token").notNull().unique(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  idToken: text("idToken"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).notNull(),
  column: text("column", { enum: ["todo", "in-progress", "done"] }).notNull(),
  order: integer("order").notNull().default(0),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const taskCategories = sqliteTable(
  "task_categories",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.taskId, t.categoryId] }),
  }),
);

export const tasksRelations = relations(tasks, ({ many }) => ({
  categories: many(taskCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tasks: many(taskCategories),
}));

export const taskCategoriesRelations = relations(taskCategories, ({ one }) => ({
  task: one(tasks, { fields: [taskCategories.taskId], references: [tasks.id] }),
  category: one(categories, { fields: [taskCategories.categoryId], references: [categories.id] }),
}));
