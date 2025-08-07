import type { NextFunction, Request, Response } from "express";
import { db } from "../server.js";
import { inventories } from "../db/schema.js";
import { CustomError } from "../lib/customError.js";
import { eq } from "drizzle-orm";
import { uuid } from "drizzle-orm/gel-core";

export const getAllInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allinventories = await db.select().from(inventories);
    res.json({ allinventories }).status(200);
  } catch (error) {
    next(new CustomError("Fail to fetch inventories", 500));
  }
};

export const addInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name} = req.body;
  try {
    const inventoryCode = Math.floor(Math.random() * 1000000).toString();
    // TODO: Set ownerId to a valid value if required by your schema
    const [newInventory] = await db
      .insert(inventories)
      .values({
        ownerId: 1,
        name,
        inventoryCode
      })
      .returning();

    res.status(201).json(newInventory);
  } catch (error) {
    next(new CustomError("Failed to add note", 500));
  }
};

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ msg: "Inventory not found" });
    }

    const [Inventory] = await db
      .select()
      .from(inventories)
      .where(eq(inventories.id, id));

    res.status(200).json(Inventory);
  } catch (error) {
    next(new CustomError("Fail to fetch Inventory", 500));
  }
};

export const modifyInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ msg: "Inventory not found" });
    }

    const { name, inventoryCode } = req.body;
    const [updatedInventory] = await db
      .update(inventories)
      .set({
        name: name ?? inventories.name,
        inventoryCode: inventoryCode ?? inventories.inventoryCode
      })
      .where(eq(inventories.id, (id)))
      .returning();

    res.status(204).json(updatedInventory);
  } catch (error) {
    next(new CustomError("Failed to update rows", 500));
  }
};

export const deleteInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ msg: "missing id" });
    }

    await db.delete(inventories).where(eq(inventories.id, (id)));
    res.status(204).json({ message: "delete successfully" });
  } catch (error) {
    next(new CustomError("Fail to delete Inventory", 500));
  }
};
