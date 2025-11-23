
import * as productRepository from "../repositories/producto.repository.js";
import * as adminService from "../services/administrador.service.js";


export async function mostrarLogin(req, res) {
  res.render("admin/login", { error: null });
}


export async function procesarLogin(req, res) {

  const { correo, contrasena } = req.body;
  console.log("procesarLogin body:", req.body);

  try {
    const admin = await adminService.loginAdmin(correo, contrasena);

   
    return res.redirect("/admin/dashboard");
  } catch (error) {

    console.error("Error en login admin:", error.message);
    return res.render("admin/login", { error: "Usuario o contraseña inválidos." });

  }
}


export async function mostrarDashboard(req, res) {

  try {
    const [productos] = await productRepository.getAllProducts();

    res.render("admin/dashboard", {
      productos,
      error: null,
    });

  } catch (error) {

    console.error(error);
    res.render("admin/dashboard", {

      productos: [],
      error: "Error al cargar los productos.",
      
    });
  }
}




// GET /admin/productos/nuevo
export async function mostrarFormularioAltaProducto(req, res) {
  try {
    const [categorias] = await productRepository.geyAllCategories(); // ojo, tu función se llama así
    res.render("admin/producto-form", {
      modo: "alta",
      producto: null,
      categorias,
      error: null
    });
  } catch (error) {
    console.error("Error al cargar formulario de alta:", error);
    res.render("admin/producto-form", {
      modo: "alta",
      producto: null,
      categorias: [],
      error: "Error al cargar las categorías."
    });
  }
}

// POST /admin/productos
export async function procesarAltaProducto(req, res) {
  try {
    const { nombre, idCategoriaProducto, precio, stock } = req.body;
    const archivo = req.file; // viene de multer

    // Validaciones simples
    if (!nombre || !idCategoriaProducto || !precio || !stock) {
      const [categorias] = await productRepository.geyAllCategories();
      return res.render("admin/producto-form", {
        modo: "alta",
        producto: null,
        categorias,
        error: "Todos los campos son obligatorios."
      });
    }

    if (!archivo) {
      const [categorias] = await productRepository.geyAllCategories();
      return res.render("admin/producto-form", {
        modo: "alta",
        producto: null,
        categorias,
        error: "Debes seleccionar una imagen para el producto."
      });
    }

    const imagen = archivo.filename; // el nombre con el que se guardó en el servidor

    await productRepository.insertProduct({
      nombre,
      idCategoriaProducto,
      precio,
      stock,
      imagen
    });

    // Si todo salió bien, volvemos al dashboard
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error al crear producto:", error);

    const [categorias] = await productRepository.geyAllCategories();
    res.render("admin/producto-form", {
      modo: "alta",
      producto: null,
      categorias,
      error: "Ocurrió un error al guardar el producto."
    });
  }
}