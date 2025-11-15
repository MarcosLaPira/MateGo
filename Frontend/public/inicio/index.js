
const inputNombre = document.getElementById("inputNombre");
const btnIrCliente = document.getElementById("btnIrCliente");

btnIrCliente.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();

  if (!nombre) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }

  // Guardamos el nombre para usar en la pantalla del cliente
  localStorage.setItem("nombreCliente", nombre);

  console.log("hola mundo")
  
  // Redirigimos a la pantalla del cliente
  window.location.href = "/public/cliente/cliente.html";
});
