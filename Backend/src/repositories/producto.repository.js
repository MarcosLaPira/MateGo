import connection from "../config/db.js";

async function getAllProducts() {
  return connection.query("SELECT * FROM producto");
}

async function getProductById(id) {
  return connection.query("SELECT * FROM producto WHERE idProducto = ?", [id]);
}

function insertProduct({ nombre, idCategoriaProducto, precio, stock, imagen }) {
  return connection.query(
    `INSERT INTO producto 
     (nombre, idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion)
     VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [nombre, idCategoriaProducto, precio, stock, imagen]
  );
}

function updateProduct(idProducto, { nombre, idCategoriaProducto, precio, stock, imagen, activo }) {
  return connection.query(
    `UPDATE producto 
     SET nombre = ?, 
         idCategoriaProducto = ?, 
         precio = ?, 
         stock = ?, 
         imagen = ?, 
         activo = ?,
         fechaActualizacion = NOW()
     WHERE idProducto = ?`,
    [nombre, idCategoriaProducto, precio, stock, imagen, activo, idProducto]
  );
}

export {
  getAllProducts,
  getProductById,
  updateProduct,
  insertProduct
};
