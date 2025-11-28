//obtencion del dom
const dataJSON = localStorage.getItem("ultimoTicket");
const ticket = JSON.parse(dataJSON);
const spanNombreCliente = document.getElementById("ticketNombreCliente");
const spanFecha = document.getElementById("ticketFecha");
const spanIdVenta = document.getElementById("ticketIdVenta");
const spanTotal = document.getElementById("ticketTotal");
const tbodyDetalle = document.getElementById("ticketDetalle");
const btnNuevoPedido = document.getElementById("btnNuevoPedido");
const btnDescargarTicket = document.getElementById("btnDescargarTicket");

if (!dataJSON) {

  // Si no hay data, volvemos a la pantalla del cliente
  alert("No hay información de ticket.Redirigiendo al inicio");
  window.location.href = "/public/inicio/index.html";

} else {


  nombreEmpresa.textContent = "MateGo - Autoservicio de mates, yerbas y mas.";

  spanNombreCliente.textContent = ticket.nombreCliente || "-";

  // Formateo de fecha
  const fecha = ticket.fecha ? new Date(ticket.fecha) : new Date();
  spanFecha.textContent = fecha.toLocaleDateString("es-AR");

  spanIdVenta.textContent = ticket.idVenta || "-";

  // Renderizamos detalle
  tbodyDetalle.innerHTML = "";

  let totalCalculado = 0;

  // recorremos los items del ticket
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


// volvemos al inicio
btnNuevoPedido.addEventListener("click", () => {
  
  //lim piamos el localStorage
  localStorage.removeItem("ultimoTicket");
  window.location.href = "/public/inicio/index.html";

});


// descargar ticket
btnDescargarTicket.addEventListener("click", () => {

  alert("Funcion disponible mas adelante cuadno la afip me investigue por evasion impositiva. No me atraparan!");

});
