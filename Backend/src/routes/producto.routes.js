import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  createProduct
} from "../controllers/producto.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/",createProduct );
router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

export default router;
