import { Router } from "express";
import {
  getAllProducts,
  getAllProductsByCategory,
  getProductById,
  updateProduct,
  createProduct
} from "../controllers/producto.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/categoria/:categoriaId", getAllProductsByCategory); // 👈 más específico
router.get("/:id", getProductById);
router.post("/",createProduct );
router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

export default router;
