import * as productRepository from "../repositories/producto.repository.js";
import { server } from "../config/enviroment.js";

// =============================
//        FIND ALL
// =============================
export async function findAllProducts() {
  const [rows] = await productRepository.getAllProducts();

  return rows.map(p => obtenerUrlImagen(p));
}

export async function findAllCategories() {
  const [rows] = await productRepository.geyAllCategories();

  return rows;
}


export async function findAllProductsByCategory(idCategoriaProducto) {


  const [rows] = await productRepository.getAllProductsByCategory(idCategoriaProducto);

  return rows.map(p => obtenerUrlImagen(p));
}

// =============================
//      FIND BY ID
// =============================
export async function findProductById(id) {
  try {
    const [rows] = await productRepository.getProductById(id);

    if (rows.length === 0) return null;

    return obtenerUrlImagen(rows[0]);

  } catch (error) {
    console.error("Error en findProductById:", error);
    return null;
  }
}

// =============================
//        CREATE PRODUCT
// =============================
export async function createProduct(data) {
  const { nombre, idCategoriaProducto, precio, stock, imagen } = data;

  if (!nombre || !idCategoriaProducto || !precio || !stock || !imagen) {
    throw new Error("Todos los campos son obligatorios: nombre, idCategoriaProducto, precio, stock, imagen");
  }

  const [result] = await productRepository.insertProduct(data);
  return result.insertId;
}

// =============================
//        UPDATE PRODUCT
// =============================
export async function updateProduct(id, data) {
  const { nombre, idCategoriaProducto, precio, stock, imagen, activo } = data;

  if (!nombre || !idCategoriaProducto || !precio || !stock || !imagen || activo == null) {
    throw new Error("Campos obligatorios: nombre, idCategoriaProducto, precio, stock, imagen, activo");
  }

  const [result] = await productRepository.updateProduct(id, data);

  if (result.affectedRows === 0) {
    return null;
  }

  return true;
}

// =============================
//     MAPEO URL IMAGEN
// =============================
function obtenerUrlImagen(product) {
  if (!product) return null;

  const baseUrl = `${server.url}:${server.port}`;

  // no modifica el objeto original, crea uno nuevo con la URL
  return {
    ...product,
    urlImagen: product.imagen 
      ? `${baseUrl}/Imagenes/${product.imagen}`
      : null
  };
}
