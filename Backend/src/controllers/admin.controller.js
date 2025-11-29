
import * as productService from "../services/producto.service.js";
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
    const productos = await productService.findAllProducts();

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
export function mostrarFormularioProducto(modo) {
  return async function (req, res) {
    try {
      const categorias = await productService.findAllCategories();
       // Si es modificación busco el prd
      let producto = null;

      if (modo === "modificacion") {       

        const { id } = req.params;

        if (!id) {
          return res.render("admin/producto-form", {
            modo,
            producto: null,
            categorias,
            error: "Falta el ID del producto."
          });
        }

        producto = await productService.findProductById(id);
      }

      res.render("admin/producto-form", {
        modo,
        producto,
        categorias,
        error: null
      });
      
    } catch (error) {
      console.error("Error al cargar formulario:", error);
      res.render("admin/producto-form", {
        modo,
        producto: null,
        categorias: [],
        error: "Error al cargar datos."
      });
    }
  };
}


// POST /admin/productos
export async function procesarAltaProducto(req, res) {
  try {
    const { nombre, idCategoriaProducto, precio, stock } = req.body;
    const archivo = req.file; // viene de multer
    const categorias = await productService.findAllCategories();

    // Validaciones simples
    if (!nombre || !idCategoriaProducto || !precio || !stock) {
      return res.render("admin/producto-form", {
        modo: "alta",
        producto: null,
        categorias,
        error: "Todos los campos son obligatorios."
      });
    }

    if (!archivo) {
      return res.render("admin/producto-form", {
        modo: "alta",
        producto: null,
        categorias,
        error: "Debes seleccionar una imagen para el producto."
      });
    }

    const imagen = archivo.filename; // el nombre con el que se guardó en el servidor

  await productService.createProduct({
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

    res.render("admin/producto-form", {
      modo: "alta",
      producto: null,
      categorias,
      error: "Ocurrió un error al guardar el producto."
    });
  }
}
// POST /admin/productos/:id/editar
export async function procesarModificacionProducto(req, res) {
  const { nombre, idCategoriaProducto, precio, stock, idProducto, activo } = req.body;
  const archivo = req.file;
  const categorias = await productService.findAllCategories();
  const oldProduct = await productService.findProductById(idProducto);

  try {

    if (!oldProduct) {
      return res.render("admin/producto-form", {
        modo: "modificacion",
        producto: null,
        categorias,
        error: "El producto que intentás editar no existe."
      });
    }

    // Validaciones básicas
    if (!nombre || !idCategoriaProducto || !precio || !stock) {
      const producto = {
        ...oldProduct,
        nombre,
        idCategoriaProducto,
        precio,
        stock
      };

      return res.render("admin/producto-form", {
        modo: "modificacion",
        producto,
        categorias,
        error: "Faltan campos obligatorios."
      });
    }

    // Imagen: nueva si hay archivo, sino la vieja
    let imagenFinal = oldProduct.imagen;
    if (archivo) {
      imagenFinal = archivo.filename;
    }

    await productService.updateProduct(idProducto, {
      nombre,
      idCategoriaProducto,
      precio,
      stock,
      imagen: imagenFinal,
      activo: activo ? true : false // si es undefined o null lo paso a false
    });

    return res.redirect("/admin/dashboard");

  } catch (error) {
    console.error("Error al modificar producto:", error);

    const producto = {
      ...oldProduct,
      nombre,
      idCategoriaProducto,
      precio,
      stock
    };

    return res.render("admin/producto-form", {
      modo: "modificacion",
      producto,
      categorias,
      error: "Ocurrió un error al guardar el producto."
    });
  }
}
