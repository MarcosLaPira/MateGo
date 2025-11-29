let deleteProduct_button = document.querySelectorAll(".btn-eliminar");

deleteProduct_button.forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation(); // Opcional acá

    const idProd = event.target.getAttribute("data-id"); 
    // o: const idProd = event.target.dataset.id;

    let confirmacion = confirm("¿Querés eliminar este producto?");

    if (!confirmacion) {
      alert("Eliminación cancelada");
    } else {
      eliminarProducto(idProd);
    }
  });
});

async function eliminarProducto(id) {
   try {
     

      let response = await fetch(`http://localhost:3000/admin/productos/${id}/eliminar`, {
          method: "DELETE"
      });

      let result = await response.json();
      console.log(result);
      if(response.ok) {
          alert(result.message);
          location.reload(); 
      }

  } catch(error) {
      console.error("Error en la solicitud DELETE: ", error);
      alert("Ocurrio un error al eliminar un producto");
  }
}

