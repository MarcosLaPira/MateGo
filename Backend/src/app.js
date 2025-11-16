import express from "express"
import cors from "cors"
import productRoutes from "./routes/producto.routes.js";
import {port} from "./config/enviroment.js";

const app = express()
// Habilitar CORS para todas las solicitudes
app.use(cors());
// permite que el servidor de Node.js pueda comprender y procesar los datos que se envían en ese formato, haciendo que los datos analizados estén disponibles en el objeto req.body de la solicitud. 
app.use(express.json());

app.use("/productos", productRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!')
})
  

app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`)
})
