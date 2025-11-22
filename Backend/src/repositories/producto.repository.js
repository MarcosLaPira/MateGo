import connection from "../config/db.js";

async function getAllProducts() {
  return connection.query("SELECT idProducto, nombre, idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion FROM producto");
}

async function geyAllCategories() {
  return connection.query("select idCategoriaProducto,descripcion from categoriaproducto");
}

async function getAllProductsByCategory (idCategoriaProducto) {
  return connection.query("SELECT idProducto, nombre, idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion FROM producto WHERE idCategoriaProducto = ?",[ idCategoriaProducto ]);
}

async function getProductById(id) {
  console.log("getProductById repository called with id:", id);
  return connection.query("SELECT idProducto, nombre, idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion FROM producto WHERE idProducto = ?", [id]);
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

function descontarStock(idProducto, cantidad) {
  return connection.query(
    `UPDATE producto
      SET stock = stock - ?
      WHERE idProducto = ?`,
    [cantidad, idProducto]
  );  
}



export {
  getAllProducts,
  geyAllCategories,
  getProductById,
  getAllProductsByCategory,
  descontarStock,
  updateProduct,
  insertProduct
};
