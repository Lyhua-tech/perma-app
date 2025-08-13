import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  pgEnum,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "inventory_owner",
  "inventory_manager",
]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  role: userRoleEnum("role").default("inventory_manager"),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpire: timestamp("reset_password_expire"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inventories = pgTable("inventories", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  inventoryCode: varchar("inventory_code", { length: 10 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  inventoryId: uuid("inventory_id")
    .notNull()
    .references(() => inventories.id),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  quantity: integer("quantity").default(0),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: varchar("image_url", { length: 255 }),
  addedById: integer("added_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
