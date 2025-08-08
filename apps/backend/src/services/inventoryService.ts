// services/inventoryService.ts
import { db } from "../server.js";
import { inventories, products } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function getAllInventories() {
  return await db.select().from(inventories);
}

export async function createInventory(name: string) {
  const inventoryCode = Math.floor(Math.random() * 1000000).toString();

  const [newInventory] = await db
    .insert(inventories)
    .values({
      ownerId: 1, // You can make this dynamic later
      name,
      inventoryCode,
    })
    .returning();

  return newInventory;
}

export async function getInventoryWithProducts(id: string) {
  const [inventory] = await db
    .select()
    .from(inventories)
    .where(eq(inventories.id, id));

  if (!inventory) return null;

  const productsInInventory = await db
    .select()
    .from(products)
    .where(eq(products.inventoryId, id));

  return { ...inventory, products: productsInInventory };
}

export async function updateInventory(
  id: string,
  name?: string,
  inventoryCode?: string
) {
  const [updatedInventory] = await db
    .update(inventories)
    .set({
      name: name ?? inventories.name,
      inventoryCode: inventoryCode ?? inventories.inventoryCode,
    })
    .where(eq(inventories.id, id))
    .returning();

  return updatedInventory;
}

export async function deleteInventoryById(id: string) {
  await db.delete(inventories).where(eq(inventories.id, id));
}
