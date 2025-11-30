// src/routes/ventas.routes.js
import { Router } from "express";
import { createVenta } from "../controllers/ventas.controller.js";

const router = Router();

//definición de rutas para ventas
router.post("/", createVenta);

export default router;
