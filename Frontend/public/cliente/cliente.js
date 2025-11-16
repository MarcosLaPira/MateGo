const API_BASE = "http://localhost:3000";

const estado = {
  nombreCliente: "",
  productos: [],
  filtroCategoria: "todas",
  carrito: []
};

// Referencias
const textoBienvenida = document.getElementById("textoBienvenida");
const btnTema = document.getElementById("btnTema");
const iconoTema = document.getElementById("iconoTema");
const filtrosCategoria = document.getElementById("filtrosCategoria");
const listaProductos = document.getElementById("listaProductos");
const carritoVacio = document.getElementById("carritoVacio");
const carritoDiv = document.getElementById("carrito");
const totalCarritoSpan = document.getElementById("totalCarrito");
const btnConfirmar = document.getElementById("btnConfirmar");
const seccionTicket = document.getElementById("seccionTicket");
const contenidoTicket = document.getElementById("contenidoTicket");
const btnNuevoPedido = document.getElementById("btnNuevoPedido");

const btnSalir = document.getElementById("btnSalir");


//cargar nombre cliente
function inicializarNombre() {
  const nombre = localStorage.getItem("nombreCliente");
  if (!nombre) {
    // si no hay nombre, volvemos al inicio
    window.location.href = "inicio.html";
    return;
  }
  estado.nombreCliente = nombre;
  textoBienvenida.textContent = `Hola, ${nombre}`;
}

// --------------- Tema claro/oscuro ---------------
const temaGuardado = localStorage.getItem("tema") || "light";
document.documentElement.setAttribute("data-theme", temaGuardado);
actualizarIconoTema();

function actualizarIconoTema() {
  const tema = document.documentElement.getAttribute("data-theme");

  if (tema === "light") {
    iconoTema.src = "/png/luna-creciente.png";  // ícono para modo claro
  } else {
    iconoTema.src = "/png/dom.png";             // ícono para modo oscuro
  }
}


btnTema.addEventListener("click", () => {
  const actual = document.documentElement.getAttribute("data-theme");
  const nuevo = actual === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", nuevo);
  localStorage.setItem("tema", nuevo);

  actualizarIconoTema();
});

btnSalir.addEventListener("click", () => {
  localStorage.removeItem("nombreCliente");
  window.location.href = "/public/inicio/index.html";
});

//cargamos los productos desde la api
async function cargarProductos() {
  try {
    const resp = await fetch(`${API_BASE}/productos`);

    if (!resp.ok) {
      throw new Error("Error al cargar productos");
    }

    // acá sí obtenés el array de productos
    const productos = await resp.json();

    console.log("Productos desde la API:", productos);

    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error("No se recibieron productos");
    }

    // filtrás por activos
    estado.productos = productos.filter(p => p.activo !== false);

    renderizarProductos();

  } catch (err) {
    console.error(err);
    listaProductos.innerHTML = "<p>Error al cargar productos.</p>";
  }
}


function renderizarProductos() {

    debugger;

  listaProductos.innerHTML = "";

  const filtrados = estado.productos.filter(p => {
    if (estado.filtroCategoria === "todas") return true;
    return p.categoria === estado.filtroCategoria;
  });

  if (filtrados.length === 0) {
    listaProductos.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  filtrados.forEach(p => {

    
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-producto";

    const imagen = p.urlImagen || "/png/imagen-no-disponible.png";

    tarjeta.innerHTML = `
      <img src="${imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <span class="precio">$${Number(p.precio).toFixed(2)}</span>
      <button class="btn-principal btn-agregar">Agregar</button>
    `;

    tarjeta.querySelector(".btn-agregar").addEventListener("click", () => {
      agregarAlCarrito(p);
    });

    listaProductos.appendChild(tarjeta);
  });
}

filtrosCategoria.addEventListener("click", async (e) => {

  const boton = e.target.closest("button");
  if (!boton) return;

  const cat = boton.dataset.cat;

  document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("btn-filtro-activo"));
  boton.classList.add("btn-filtro-activo");

  if (cat === "todas") {
    // reutilizás tu cargarProductos general
    await cargarProductos();
    return;
  }

  try {

    const resp = await fetch(`${API_BASE}/productos/categoria/${cat}`);
    const data = await resp.json();

    if (!resp.ok) {
      alert(data.error || "Error al obtener productos por categoría.");
      return;
    }

    estado.productos = data;
    renderizarProductos();

  } catch (error) {
    console.error(error);

    alert("Error de red al filtrar productos.");
    
  }
});


// --------------- Carrito ---------------
function agregarAlCarrito(prod) {
  const item = estado.carrito.find(i => i.idProducto === prod.idProducto);
  if (item) {
    item.cantidad++;
  } else {
    estado.carrito.push({
      idProducto: prod.idProducto,
      nombre: prod.nombre,
      precio: Number(prod.precio),
      cantidad: 1
    });
  }
  renderizarCarrito();
}

function renderizarCarrito() {
  carritoDiv.innerHTML = "";

  if (estado.carrito.length === 0) {
    carritoVacio.style.display = "block";
    totalCarritoSpan.textContent = "$0";
    return;
  }

  carritoVacio.style.display = "none";

  let total = 0;

  estado.carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const fila = document.createElement("div");
    fila.className = "item-carrito";

    fila.innerHTML = `
      <span class="nombre">${item.nombre}</span>
      <span>$${item.precio.toFixed(2)}</span>
      <input type="number" min="1" value="${item.cantidad}">
      <span class="subtotal">$${subtotal.toFixed(2)}</span>
      <button class="btn-eliminar">Quitar</button>
    `;

    const inputCant = fila.querySelector("input");
    inputCant.addEventListener("change", () => {
      let cant = parseInt(inputCant.value, 10);
      if (isNaN(cant) || cant < 1) cant = 1;
      item.cantidad = cant;
      renderizarCarrito();
    });

    fila.querySelector(".btn-eliminar").addEventListener("click", () => {
      estado.carrito = estado.carrito.filter(i => i.idProducto !== item.idProducto);
      renderizarCarrito();
    });

    carritoDiv.appendChild(fila);
  });

  totalCarritoSpan.textContent = `$${total.toFixed(2)}`;
}


//confirmar pedido api
btnConfirmar.addEventListener("click", async () => {
  if (estado.carrito.length === 0) {
    alert("Tu pedido está vacío.");
    return;
  }

  const cuerpo = {
    nombreCliente: estado.nombreCliente,
    items: estado.carrito.map(i => ({
      idProducto: i.idProducto,
      cantidad: i.cantidad
    }))
  };

  try {
    const resp = await fetch(`${API_BASE}/ventas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    });

    const data = await resp.json();
    if (!resp.ok) {
      alert(data.error || "Error al registrar la venta.");
      return;
    }

    mostrarTicket(data.idVenta);
  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor.");
  }
});

function mostrarTicket(idVenta) {
  const fecha = new Date().toLocaleString();

  let html = `
    <p><strong>Cliente:</strong> ${estado.nombreCliente}</p>
    <p><strong>Fecha:</strong> ${fecha}</p>
    <p><strong>Detalle del pedido:</strong></p>
    <ul>
  `;

  let total = 0;
  estado.carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `<li>${item.nombre} x${item.cantidad} - $${subtotal.toFixed(2)}</li>`;
  });

  html += `</ul>`;
  html += `<p><strong>Total estimado:</strong> $${total.toFixed(2)}</p>`;

  const urlTicket = `${API_BASE}/ventas/${idVenta}/ticket.pdf`;
  html += `
    <p>Descargá tu ticket en PDF para mostrar en caja:</p>
    <p><a href="${urlTicket}" target="_blank">Descargar ticket PDF</a></p>
  `;

  contenidoTicket.innerHTML = html;
  seccionTicket.classList.remove("oculto");
}

// nuevo pedido
btnNuevoPedido.addEventListener("click", () => {
  
  window.location.href = "/public/inicio/index.html";
});


// Inicialización
inicializarNombre();
cargarProductos();
cargarCategorias();
renderizarCarrito();

async function cargarCategorias() {

  try {
    const resp = await fetch(`${API_BASE}/productos/categorias`);
    const data = await resp.json();

    if (!resp.ok) {
      console.error("Error al obtener categorías:", data);
      alert(data.error || "Error al obtener categorías.");
      return;
    }

    // Limpio cualquier cosa previa
    filtrosCategoria.innerHTML = "";

    // Botón "Todas"
    filtrosCategoria.innerHTML += `
      <button data-cat="todas" class="btn-filtro btn-filtro-activo">Todas</button>
    `;

    // Botones de cada categoría
    data.forEach((cat) => {

      filtrosCategoria.innerHTML += `
        <button data-cat="${cat.idCategoriaProducto}" class="btn-filtro">
          ${cat.descripcion}
        </button>

      `;
    });

  } catch (error) {

    console.error("Error de red al obtener categorías:", error);
    alert("No se pudieron cargar las categorías. Intentá más tarde.");

  }
}

