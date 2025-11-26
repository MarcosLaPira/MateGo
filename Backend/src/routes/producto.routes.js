import { Router } from "express";
import {
  getAllProducts,
  getAllProductsByCategory,
  GetAllCategories,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct
} from "../controllers/producto.controller.js";

import {
  validateId
} from "../middlewares/middlewares.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/categoria/:categoriaId",validateId, getAllProductsByCategory); 
router.get("/categorias", GetAllCategories); 
router.get("/:id",validateId, getProductById);
router.post("/",createProduct );
router.put("/:id",validateId, updateProduct);
router.delete("/:id",validateId, deleteProduct);

export default router;
