import express from "express";
import cors from "cors";
import productRoutes from "./routes/producto.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { server } from "./config/enviroment.js";

import path from "path";
import { fileURLToPath } from "url";



//Inicializamos la aplicación Express.
const app = express() 

//obtener la ruta real del archivo actual y su carpeta.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Habilitar CORS para todas las solicitudes 
app.use(cors()); 

// permite que el servidor de Node  comprenda y registre datos del json
app.use(express.json());


// par permitir fomurlarios ejs
app.use(express.urlencoded({ extended: true }));

//hace pública la carpeta /public, permitiendo acceder a sus archivos directamente desde el navegador.
app.use(express.static(path.join(__dirname, "..", "public")));



// Configurar EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Asignamos las rutas del módulo de productos.
// Cualquier ruta dentro de productRoutes quedará bajo /productos
app.use("/productos", productRoutes);
app.use("/ventas", ventasRoutes); 


// Rutas Admin (EJS)
app.use("/admin", adminRoutes);


// Ruta base para probar que el servidor está funcionando. 
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Muestra en consola la URL local para acceder a la API.
app.listen(server.port, () => {
  console.log(`Servidor corriendo en http://localhost:${server.port}`);
});
