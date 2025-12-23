import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
  id: integer().primaryKey({ autoIncrement: true }),
  text: text().notNull(),
  createdAt: integer("created_at").notNull(),
});

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(), // GitHub Id
  title: text("title").notNull(),
  completed: integer("completed").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fen: text("fen"),
  pgn: text("pgn").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
