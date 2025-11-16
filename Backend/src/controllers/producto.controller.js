import * as productService from "../services/producto.service.js";

export async function getAllProducts(req, res) {
  console.log("getAllProducts controller called");
  try {
    const productos = await productService.findAllProducts();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.findProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function createProduct(req, res) {
  try {
    const id = await productService.createProduct(req.body);

    res.status(201).json({
      message: "Producto creado correctamente",
      id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const done = await productService.updateProduct(id, req.body);

    if (!done) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}