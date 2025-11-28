import * as productService from "../services/producto.service.js";

export async function getAllProducts(req, res) {
  // console.log("getAllProducts controller called");
  try {
    const productos = await productService.findAllProducts();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllProductsByCategory(req, res) {
  // console.log("getAllProducts controller called");
  try {

    console.log(req.params);
    const { categoriaId } = req.params;
    console.log("Hola mundo");

    if (!categoriaId) {
      return res.status(400).json({ error: "El parámetro idCategoriaProducto es obligatorio" });
    }
    console.log("idCategoriaProducto:", categoriaId);
    const productos = await productService.findAllProductsByCategory(categoriaId);
    res.json(productos);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function GetAllCategories(req, res) {
  try {
    
    console.log("GetAllCategories controller called");
   
    const categorias = await productService.findAllCategories();
    res.json(categorias);ss

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

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);

    if (!result) {
     return res.status(400).json({ message: "No se elimino el producto" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" }  );

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