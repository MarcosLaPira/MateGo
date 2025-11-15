// =============================
// Ejercicio 1 - Array de frutas
// =============================

// Array con todas las frutas.
// Cada fruta es un objeto con id, nombre, precio e imagen.

const frutas = [
  { id: 1, nombre: "Anana", precio: 400, ruta: "../img/anana.jpg" }, 
  { id: 2, nombre: "Arandano", precio: 150, ruta: "../img/arandano.jpg" },
  { id: 3, nombre: "Banana", precio: 120, ruta: "../img/banana.jpg" },
  { id: 4, nombre: "frambuesa", precio: 140, ruta: "../img/frambuesa.png" },
  { id: 5, nombre: "frutilla", precio: 170, ruta: "../img/frutilla.jpg" },
  { id: 6, nombre: "kiwi", precio: 190, ruta: "../img/kiwi.jpg" },
  { id: 7, nombre: "mandarina", precio: 200, ruta: "../img/mandarina.jpg" },
  { id: 8, nombre: "naranja", precio: 101, ruta: "../img/naranja.jpg" },
  { id: 9, nombre: "pera", precio: 205, ruta: "../img/pera.jpg" },
  { id: 10, nombre: "pomelo amarillo", precio: 100, ruta: "../img/pomelo-amarillo.jpg" },
  { id: 11, nombre: "pomelo rojo", precio: 90, ruta: "../img/pomelo-rojo.jpg" },
  { id: 12, nombre: "sandia", precio: 100, ruta: "../img/sandia.jpg" },
  { id: 13, nombre: "manzana", precio: 100, ruta: "../img/manzana.jpg" }
];

// ================================
// Ejercicio 2 - Datos del alumno
// ================================

// Objeto con mis datos personales.
// Lo usamos para mostrar en consola y en el <nav> del HTML.
const alumno = {
  dni: "43398679",
  nombre: "Lautaro",
  apellido: "Moreira"
};

// Función que imprime los datos del alumno.
// Muestra el nombre y apellido en consola y también lo agrega al <nav>.
function imprimirDatosAlumno() {
  console.log(`Alumno: ${alumno.nombre} ${alumno.apellido} - DNI: ${alumno.dni}`);

  const nav = document.getElementById("alumno");
  const span = document.createElement("span");
  span.textContent = `${alumno.nombre} ${alumno.apellido}`;
  nav.appendChild(span);
}

// ================================
// Ejercicio 3 - Mostrar productos
// ================================

// Esta funcion recibe una lista de frutas y las pone en la pantalla
// Por cada fruta genera una card
function mostrarProductos(listaFrutas) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  listaFrutas.forEach(fruta => {
    const card = document.createElement("div");
    card.classList.add("card-producto");

    const img = document.createElement("img");
    img.src = fruta.ruta;
    img.alt = fruta.nombre;

    const titulo = document.createElement("h3");
    titulo.textContent = fruta.nombre;

    const precio = document.createElement("p");
    precio.textContent = `$${fruta.precio}`;

    const boton = document.createElement("button");
    boton.textContent = "Agregar al carrito";
    boton.addEventListener("click", () => {
      agregarAlCarrito(fruta);
    });

    card.appendChild(img);
    card.appendChild(titulo);
    card.appendChild(precio);
    card.appendChild(boton);

    contenedor.appendChild(card);
  });
}

// ================================
// Ejercicio 4 - Filtro de productos
// ================================

// Esta funcion se ejecuta cada vez que el usuario escribe en el input de busqueda
// Toma lo que se escribió, lo pasa a minúsculas y filtra las frutas que empiecen con ese texto. Después muestra solo esas frutas que matchean.

function filtrarProductos(event) {
  const texto = event.target.value.toLowerCase();
  const filtrados = frutas.filter(fruta =>
    fruta.nombre.toLowerCase().startsWith(texto)
  );
  mostrarProductos(filtrados);
}
// ===================================
// Ejercicios 5 y 6 - Carrito + LocalStorage
// ===================================

// Array vacío donde vamos a ir guardando lo que el usuario agrega al carrito
let carrito = [];

// Guarda el carrito en localStorage (se convierte a JSON porque localStorage solo guarda texto)
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Carga el carrito desde localStorage (si existe) y lo muestra
function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  if (data) {
    carrito = JSON.parse(data); // lo paso de texto a array
    mostrarCarrito();
  }
}

// Agrega una fruta al carrito
function agregarAlCarrito(fruta) {
  carrito.push(fruta);
  console.log("Carrito actualizado:", carrito);
  mostrarCarrito();
  guardarCarrito(); // lo guardo para que no se pierda si recargo
}

// Elimina una fruta del carrito por su posición en el array
function eliminarProducto(indice) {
  carrito.splice(indice, 1); // borro 1 elemento en ese índice
  console.log("Producto eliminado:", carrito);
  mostrarCarrito();
  guardarCarrito();
}

// Muestra el carrito en pantalla
function mostrarCarrito() {
  const listaCarrito = document.getElementById("lista-carrito");
  listaCarrito.innerHTML = ""; // limpio antes de volver a dibujar

  let total = 0; // acumulador para el precio total

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("bloque-item");

    // nombre y precio del producto
    const texto = document.createElement("p");
    texto.classList.add("nombre-item");
    texto.textContent = `${item.nombre} - $${item.precio}`;
    total += item.precio;

    // botón para eliminar ese producto
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("boton-eliminar");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
      eliminarProducto(index);
    });

    // armo el item y lo agrego a la lista
    li.appendChild(texto);
    li.appendChild(botonEliminar);
    listaCarrito.appendChild(li);
  });

  // Actualizar contador de productos en el header
  const contador = document.getElementById("contador-carrito");
  contador.textContent = `Carrito: ${carrito.length} producto(s)`;

  // Actualizar total de la compra
  const totalElemento = document.getElementById("total-carrito");
  totalElemento.textContent = `Total: $${total}`;
}
// ================================
// Ejercicio 8 - Ordenar
// ================================

// Ordena las frutas por nombre (A-Z) y las muestra
function ordenarPorNombre() {
  const ordenados = [...frutas].sort((a, b) => a.nombre.localeCompare(b.nombre));
  mostrarProductos(ordenados);
}

// Ordena las frutas por precio (de menor a mayor) y las muestra
function ordenarPorPrecio() {
  const ordenados = [...frutas].sort((a, b) => a.precio - b.precio);
  mostrarProductos(ordenados);
}

// ================================
// Ejercicio 9 - Vaciar carrito
// ================================

// Deja el carrito vacío y actualiza la vista y el localStorage
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
}

// ================================
// Inicialización
// ================================

// Esta función arranca todo cuando carga la página
function init() {
  imprimirDatosAlumno(); // muestro mis datos
  mostrarProductos(frutas); // muestro todas las frutas
  cargarCarrito(); // si había carrito guardado, lo cargo

  // Eventos para el buscador y botones
  const inputFiltro = document.getElementById("filtro");
  inputFiltro.addEventListener("input", filtrarProductos);

  document.getElementById("ordenar-nombre").addEventListener("click", ordenarPorNombre);
  document.getElementById("ordenar-precio").addEventListener("click", ordenarPorPrecio);
  document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
}

// Espero a que cargue todo el HTML para ejecutar init
document.addEventListener("DOMContentLoaded", init);
