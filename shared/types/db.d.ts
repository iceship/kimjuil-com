import type { schema } from "hub:db";

export type Todo = typeof schema.todos.$inferSelect;
export type Message = typeof schema.messages.$inferSelect;
