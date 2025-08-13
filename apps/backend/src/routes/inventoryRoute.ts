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

router.get("/inventories", authenticateJWT, getAllInventory);
router.get("/inventory/:id", authenticateJWT, getInventory);
router.post("/addInventory", authenticateJWT, addInventory);
router.put("/updateInventoryInfo/:id", modifyInventory);
router.delete("/deleteInventory/:id", deleteInventory);

export default router;
