// controllers/inventoryController.ts
import type { Request, Response, NextFunction } from "express";
import * as InventoryService from "../services/inventoryService.js";
import { CustomError } from "../lib/customError.js";

export const getAllInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allInventories = await InventoryService.getAllInventories();
    res.status(200).json({ allInventories });
  } catch (error) {
    console.error(error);
    next(new CustomError("Fail to fetch inventories", 500));
  }
};

export const addInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const newInventory = await InventoryService.createInventory(name);
    res.status(201).json(newInventory);
  } catch (error) {
    console.error(error);

    next(new CustomError("Failed to add inventory", 500));
  }
};

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(404).json({ msg: "Inventory not found" });

    const inventory = await InventoryService.getInventoryWithProducts(id);

    if (!inventory) return res.status(404).json({ msg: "Inventory not found" });

    res.status(200).json(inventory);
  } catch (error) {
    next(new CustomError("Fail to fetch inventory", 500));
  }
};

export const modifyInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ msg: "Inventory not found" });

    const { name, inventoryCode } = req.body;
    const updatedInventory = await InventoryService.updateInventory(
      id,
      name,
      inventoryCode
    );

    res.status(200).json(updatedInventory);
  } catch (error) {
    next(new CustomError("Failed to update inventory", 500));
  }
};

export const deleteInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ msg: "Missing id" });

    await InventoryService.deleteInventoryById(id);
    res.status(204).json({ message: "Deleted successfully" });
  } catch (error) {
    next(new CustomError("Fail to delete inventory", 500));
  }
};
