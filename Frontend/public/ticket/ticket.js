

//leemos el id del ultimol ticket guarddado
const dataJSON = localStorage.getItem("ultimoTicket");

if (!dataJSON) {

  // Si no hay data, volvemos a la pantalla del cliente
  alert("No hay información de ticket. Volviendo a la tienda.");
  window.location.href = "/public/inicio/index.html";

} else {

  const ticket = JSON.parse(dataJSON);

  const spanNombreCliente = document.getElementById("ticketNombreCliente");
  const spanFecha = document.getElementById("ticketFecha");
  const spanIdVenta = document.getElementById("ticketIdVenta");
  const spanTotal = document.getElementById("ticketTotal");
  const tbodyDetalle = document.getElementById("ticketDetalle");
 


 
  nombreEmpresa.textContent = "MateGo - Autoservicio de mates, yerbas y mas.";

  spanNombreCliente.textContent = ticket.nombreCliente || "-";

  // Formateo de fecha
  const fecha = ticket.fecha ? new Date(ticket.fecha) : new Date();
  spanFecha.textContent = fecha.toLocaleDateString("es-AR");

  spanIdVenta.textContent = ticket.idVenta || "-";

  // Renderizamos detalle
  tbodyDetalle.innerHTML = "";

  let totalCalculado = 0;

  (ticket.items || []).forEach((item) => {

    const tr = document.createElement("tr");

    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 0;
    const subtotal = precio * cantidad;
    totalCalculado += subtotal;

    tr.innerHTML = `
      <td>${item.nombre || `Producto #${item.idProducto}`}</td>
      <td>${cantidad}</td>
      <td>$${precio.toFixed(2)}</td>
      <td>$${subtotal.toFixed(2)}</td>
    `;

    tbodyDetalle.appendChild(tr);

  });

  const totalFinal = ticket.total != null ? Number(ticket.total) : totalCalculado;
  spanTotal.textContent = `$${totalFinal.toFixed(2)}`;

}

// Botones
const btnNuevoPedido = document.getElementById("btnNuevoPedido");
const btnDescargarTicket = document.getElementById("btnDescargarTicket");

// volvemos al inicio
btnNuevoPedido.addEventListener("click", () => {
  
  //lim piamos el localStorage
   localStorage.removeItem("ultimoTicket");
  window.location.href = "/public/inicio/index.html";
});


// descargar ticket
btnDescargarTicket.addEventListener("click", () => {
  alert("Mas adelante la hago");
});
