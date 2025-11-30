import connection from "../config/db.js";

// Productos
async function getAllProducts() {
  return connection.query("SELECT idProducto, nombre, p.idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion,cp.descripcion FROM producto p inner join categoriaproducto cp on cp.idcategoriaproducto = p.idcategoriaproducto order by p.idProducto");
}

// Categorias de Productos
async function getAllCategories() {
  return connection.query("select idCategoriaProducto,descripcion from categoriaproducto");
}

// Productos por Categoria
async function getAllProductsByCategory (idCategoriaProducto) {
  return connection.query("SELECT idProducto, nombre, idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion FROM producto WHERE idCategoriaProducto = ?",[ idCategoriaProducto ]);
}

// Producto por ID
async function getProductById(id) {
   return connection.query("SELECT idProducto, nombre, idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion FROM producto WHERE idProducto = ?", [id]);
}

// Eliminar Producto (set activo = false)
async function deleteProduct(id) {
   return connection.query(
    `UPDATE producto 
     SET activo = false,
         fechaActualizacion = NOW()
     WHERE idProducto = ?`,
    [id]
  );;
}

// Insertar Producto
function insertProduct({ nombre, idCategoriaProducto, precio, stock, imagen }) {
  return connection.query(
    `INSERT INTO producto 
     (nombre, idCategoriaProducto, precio, stock, imagen, activo, fechaCreacion, fechaActualizacion)
     VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [nombre, idCategoriaProducto, precio, stock, imagen]
  );
}

// Actualizar Producto
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

// Descontar Stock
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
  getAllCategories,
  getProductById,
  getAllProductsByCategory,
  descontarStock,
  updateProduct,
  insertProduct,
  deleteProduct
};
