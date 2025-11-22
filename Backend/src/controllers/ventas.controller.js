import * as ventasService from "../services/ventas.service.js";

export async function createVenta(req, res) {

    console.log("createVenta controller called with body:", req.body);

  try {
    const idVenta = await ventasService.createVenta(req.body);

    res.status(201).json({
      message: "Venta insertada correctamente",
      idVenta,
    });
  } catch (error) {

    console.error("Error en createVenta:", error);
    res.status(400).json({ error: error.message });

  }
}
  