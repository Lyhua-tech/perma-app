import { Router } from "express";
import {
  addInventory,
  deleteInventory,
  getAllInventory,
  getInventory,
  modifyInventory,
} from "../handler/inventoryHandler.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = Router();

router.get("/inventories", getAllInventory);
router.get("/inventory/:id", getInventory);
router.post("/addInventory", authenticateJWT, addInventory);
router.put("/updateInventoryInfo/:id", modifyInventory);
router.delete("/deleteInventory/:id", deleteInventory);

export default router;
