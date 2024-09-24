import {
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey().notNull(),
    email: varchar("email").notNull(),
    password: varchar("password").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      userUnique: unique("user_unique").on(table.email),
    };
  }
);

export const post = pgTable("post", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title"),
  text: text("text"),
  userId: serial("user_id").references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
