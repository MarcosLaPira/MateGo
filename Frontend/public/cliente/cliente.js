//definimos url de api base localhost
const API_BASE = "http://localhost:3000";

// Estado global
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

const temaGuardado = localStorage.getItem("tema") || "light"; //tema claro y oscuro
document.documentElement.setAttribute("data-theme", temaGuardado);


actualizarIconoTema();


// Inicialización
inicializarNombre();
cargarProductos();
cargarCategorias();
renderizarCarrito();


//FUNCIONES

//cargar nombre cliente desde localStorage
function inicializarNombre() {

  const nombre = localStorage.getItem("nombreCliente");
  
  if (!nombre) {
    
    window.location.href = "inicio.html";// si no hay nombre, volvemos al inicio
    return;
  }

  estado.nombreCliente = nombre;
  textoBienvenida.textContent = `Hola, ${nombre}!`;

}

// actualizar ícono de tema
function actualizarIconoTema() {

  const tema = document.documentElement.getAttribute("data-theme");

  if (tema === "light") {
    iconoTema.src = "/png/luna-creciente.png";  // ícono para modo claro
  } else {
    iconoTema.src = "/png/dom.png";             // ícono para modo oscuro
  }
  
}

// cambiar tema al hacer clic
btnTema.addEventListener("click", () => {

  const actual = document.documentElement.getAttribute("data-theme");
  const nuevo = actual === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", nuevo);//cambiamos icono
  localStorage.setItem("tema", nuevo);

  actualizarIconoTema();

});


// salir y volver al inicio
btnSalir.addEventListener("click", () => {

  localStorage.removeItem("nombreCliente");//removemos nombre del localStorage
  window.location.href = "/public/inicio/index.html";

});



//cargamos los productos desde la api
async function cargarProductos() {

  try {

    const resp = await fetch(`${API_BASE}/productos`);

    if (!resp.ok) {
      throw new Error("Error al cargar productos");
    }

    
    const productos = await resp.json();// parseamos json

    console.log("Productos desde la API:", productos);

    if (!Array.isArray(productos) || productos.length === 0) { //validaciones
      throw new Error("No se recibieron productos");
    }

   
    estado.productos = productos.filter(p => p.activo !== 0);//filtramos solo los productos activos por el administrador

    renderizarProductos();

  } catch (err) {

    console.error(err);
    listaProductos.innerHTML = "<p>Error al cargar productos.</p>";
    alert("No se pudieron cargar los productos desde la base de datos.Chequeá la conexión a internet.Intenta mas tarde");
  }

}

// renderizamos productos en el DOM
function renderizarProductos() {

    debugger;

  listaProductos.innerHTML = "";//limpiamos lista antes de renderizar

  //filtramos por categoría solicitada
  const filtrados = estado.productos.filter(p => {

    if (estado.filtroCategoria === "todas") return true;
    return p.categoria === estado.filtroCategoria;

  });

  if (filtrados.length === 0) {

    listaProductos.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;

  }

  // recorremos productos filtrados y los agregamos al DOM
  //creamos la tarjeta por cada producto
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

    // funcion manejador para agregar al carrito
    tarjeta.querySelector(".btn-agregar").addEventListener("click", () => {

      agregarAlCarrito(p);

    });

    listaProductos.appendChild(tarjeta);

  });
}

//funcion filtro por categoria activa
filtrosCategoria.addEventListener("click", async (e) => {

  const boton = e.target.closest("button");// si no es un boton, salimos
  if (!boton) return;

  const cat = boton.dataset.cat;//obtenemos categoria del boton

  document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("btn-filtro-activo"));// quitamos clase activa de todos
  boton.classList.add("btn-filtro-activo");// agregamos clase activa al boton clickeado

  if (cat === "todas") {

    //llamamos a cargar productos general
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

    estado.productos = data;// actualizamos productos en estado
    renderizarProductos();//mostramos los productos filtrados

  } catch (error) {

    console.error(error);

    alert("Error de red al filtrar productos.");

  }
});


// agregar producto al carrito
function agregarAlCarrito(prod) {

  const item = estado.carrito.find(i => i.idProducto === prod.idProducto);//buscamos si ya existe en el carrito

  if (item) {

    item.cantidad++;//si ya existe aumentamos cantidad

  } else {

    //si no existe, lo agregamos con cantidad 1
    estado.carrito.push({

      idProducto: prod.idProducto,
      nombre: prod.nombre,
      precio: Number(prod.precio),
      cantidad: 1

    });

  }

  renderizarCarrito();

}

// renderizar carrito en el DOM
function renderizarCarrito() {

  carritoDiv.innerHTML = "";//limpiamos carrito

  if (estado.carrito.length === 0) {

    //carritoVacio.style.display = "flex";//
    totalCarritoSpan.textContent = "$0";
    return;

  }

  carritoVacio.style.display = "none";// ocultamos mensaje de carrito vacío

  let total = 0;

  estado.carrito.forEach(item => {

    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const fila = document.createElement("div");
    fila.className = "item-carrito";

    // plantilla de fila de carrito
    fila.innerHTML = `
      <span class="nombre">${item.nombre}</span>
      <span>$${item.precio.toFixed(2)}</span>
      <input type="number" min="1" value="${item.cantidad}">
      <span class="subtotal">$${subtotal.toFixed(2)}</span>
      <button class="btn-eliminar">
         <img id="iconoTema" src="/png/borrar.png" alt="" class="logoImagenTema">
      </button>
    `;


    
    const inputCant = fila.querySelector("input");

    inputCant.addEventListener("change", () => {

      let cant = parseInt(inputCant.value, 10);// obtenemos nueva cantidad
      if (isNaN(cant) || cant < 1) cant = 1;// validamos cantidad mínima
      item.cantidad = cant;// actualizamos cantidad en el estado

      renderizarCarrito();// re-renderizamos carrito para reflejar cambios desde el carrito 
    });
    

    fila.querySelector(".btn-eliminar").addEventListener("click", () => {

      estado.carrito = estado.carrito.filter(i => i.idProducto !== item.idProducto);// removemos item del carrito
      renderizarCarrito();

    });

    carritoDiv.appendChild(fila);// agregamos fila al carrito en el DOM

  });

  totalCarritoSpan.textContent = `$${total.toFixed(2)}`;// actualizamos total del carrito
}

// Confirmar pedido y a la base de datos
btnConfirmar.addEventListener("click", async () => {

  if (estado.carrito.length === 0) {

    alert("No se puede ejecutar compra. Tu carrito esta vacio. Por favor selecciona al menos 1 producto de nuestra tienda.");
    return;
  }

  // Calculamos total en el front (también se calcula en el back, pero lo usamos para mostrar rápido)
  const total = estado.carrito.reduce((acc, item) => {

    const precio = Number(item.precio) || 0;
    return acc + precio * item.cantidad;

  }, 0);

  const cuerpo = {

    nombreCliente: estado.nombreCliente,
    detalleVenta: estado.carrito.map(i => ({
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

    // Guardamos info del ticket en localStorage
    const ticketData = {

      idVenta: data.idVenta,
      nombreCliente: estado.nombreCliente,
      fecha: new Date().toISOString(),
      empresa: "MateGo - Autoservicio de mates y yerbas",
      items: estado.carrito,   // asumimos que cada item tiene nombre, precio, cantidad, etc.
      total: total

    };

    localStorage.setItem("ultimoTicket", JSON.stringify(ticketData));

    // Limpiamos carrito en memoria 
    estado.carrito = [];
   

    // Redirigimos a la pantalla de ticket
    window.location.href = "/public/ticket/ticket.html";

  } catch (err) {

    console.error(err);
    alert("Error de conexión con el servidor.");

  }
});




// cargar las categorias desde la api base de datos
async function cargarCategorias() {

  try {

    const resp = await fetch(`${API_BASE}/productos/categorias`);
    const data = await resp.json();

    if (!resp.ok) {

      console.error("Error al obtener categorías:", data);
      alert(data.error || "Error al obtener categorías.");
      return;

    }

    // Limpiamos filtros antes de renderizar
    filtrosCategoria.innerHTML = "";

    // parametrizamos por defecto el boton de todas las categorias
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

