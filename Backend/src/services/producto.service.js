import * as productRepository from "../repositories/producto.repository.js";

export async function findAllProducts() {
  const [rows] = await productRepository.getAllProducts();
  return rows;
}

export async function findProductById(id) {
  const [rows] = await productRepository.getProductById(id);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}
export async function createProduct(data) {
  const { nombre, idCategoriaProducto, precio, stock, imagen } = data;

  if (!nombre || !idCategoriaProducto || !precio || !stock || !imagen) {
    throw new Error("Todos los campos son obligatorios: nombre, idCategoriaProducto, precio, stock, imagen");
  }

  const [result] = await productRepository.insertProduct(data);
  return result.insertId;
}

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
