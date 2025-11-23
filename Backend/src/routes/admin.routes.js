// src/routes/admin.routes.js
import { Router } from "express";
import {
  mostrarLogin,
  procesarLogin,
  mostrarDashboard,
  mostrarFormularioAltaProducto,
  procesarAltaProducto
} from "../controllers/admin.controller.js";

import { upload } from "../config/multer.js"; // ya lo venís usando para productos API

const router = Router();

// Login
router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);

// Dashboard
router.get("/dashboard", mostrarDashboard);

// Alta de producto (admin)
router.get("/productos/nuevo", mostrarFormularioAltaProducto);

// POST alta de producto con imagen
router.post(
  "/productos",
  upload.single("imagen"), // "imagen" tiene que coincidir con el name del input file
  procesarAltaProducto
);

router.get("/", (req, res) => {
  res.redirect("/admin/login");
});

export default router;
