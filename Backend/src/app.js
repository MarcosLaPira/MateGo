import express from "express";
import cors from "cors";
import productRoutes from "./routes/producto.routes.js";
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

// permite que el servidor de Node.js pueda comprender y procesar los datos que se envían en ese formato, haciendo que los datos analizados estén disponibles en el objeto req.body de la solicitud. 
app.use(express.json());

//hace pública la carpeta /public, permitiendo acceder a sus archivos directamente desde el navegador.
app.use(express.static(path.join(__dirname, "..", "public")));

// Asignamos las rutas del módulo de productos.
// Cualquier ruta dentro de productRoutes quedará bajo /productos
app.use("/productos", productRoutes);

// Ruta base para probar que el servidor está funcionando. 
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Muestra en consola la URL local para acceder a la API.
app.listen(server.port, () => {
  console.log(`Servidor corriendo en http://localhost:${server.port}`);
});
