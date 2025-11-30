import connection from "../config/db.js";

// Insertar una nueva venta
export async function insertVenta( { nombreCliente, total }) {
  
  const [result] = await connection.query(
      `INSERT INTO venta (nombreCliente, fecha, total)
      VALUES (?, NOW(), ?)`,
       [nombreCliente, total]
    );
  
  return result.insertId; // idVenta
  
}

// Insertar un detalle de venta
export async function insertDetalleVenta( { idVenta, idProducto, cantidad, precioUnitario }) {
  
  return connection.query(
    `INSERT INTO detalleventa (idVenta, idProducto, cantidad, precioUnitario)
     VALUES (?, ?, ?, ?)`
    , [idVenta, idProducto, cantidad, precioUnitario]
  );

}
