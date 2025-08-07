import Router from "express";
import { addProduct, getAllProduct } from "../handler/productHandler.js";
import { photoUpload } from "../lib/multer.js";

const router = Router();

router.post("/add", photoUpload.single("image"), addProduct);
router.get("/", getAllProduct);

export default router;
