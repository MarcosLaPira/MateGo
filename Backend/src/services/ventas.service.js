// src/services/ventas.service.js
import * as ventasRepository from "../repositories/ventas.repository.js";
import * as productoRepository from "../repositories/producto.repository.js";

// Servicio para crear una nueva venta
export async function createVenta(data) {
 
    console.log("createVenta service called with data:", data);
  const { nombreCliente, detalleVenta } = data;

  
  if (!nombreCliente || typeof nombreCliente !== "string") {
    throw new Error("El nombre del cliente es obligatorio");
  }

  if (!Array.isArray(detalleVenta) || detalleVenta.length === 0) {
    throw new Error("La venta debe tener al menos un producto");
  }


  // Valida items
  detalleVenta.forEach((item, i) => {

    if (!item.idProducto || !item.cantidad) {
      throw new Error(`El item #${i + 1} debe tener idProducto y cantidad`);
    }

    if (item.cantidad <= 0) {
      throw new Error(`La cantidad del item #${i + 1} debe ser mayor a 0`);
    }

  });

 

  try {
  

    let total = 0;
    const detallesListos = [];

    // Verificar cada producto, stock y calcular total
    for (const item of detalleVenta) {

     const [rows] = await productoRepository.getProductById(item.idProducto);
     const producto = rows[0];


      if (!producto) {
        throw new Error(`El producto con id ${item.idProducto} no existe`);
      }

      if (!producto.activo) {
        throw new Error(`El producto "${producto.nombre}" está inactivo`);
      }

      if (producto.stock < item.cantidad) {
        throw new Error(`No hay stock suficiente para "${producto.nombre}". Stock: ${producto.stock}`);
      }

      const precioUnitario = Number(producto.precio);
      const subtotal = precioUnitario * item.cantidad;

      total += subtotal;

      detallesListos.push({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario,

      });

    }

    // Insertar venta
    const idVenta = await ventasRepository.insertVenta( {
      nombreCliente,
      total,
    });

    // Insertar detalleventa
    for (const det of detallesListos) {

      await ventasRepository.insertDetalleVenta( {
        idVenta,
        idProducto: det.idProducto,
        cantidad: det.cantidad,
        precioUnitario: det.precioUnitario,
      });

      //  actualizar stock
      await productoRepository.descontarStock( det.idProducto, det.cantidad);
    }

   

    return idVenta;

  } catch (error) {

    
    throw error;

  }
}
