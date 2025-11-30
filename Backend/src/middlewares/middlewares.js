
// Middleware de aplicacion -> Se aplica a todas las rutas
// Middleware logger para mostrar por consola todas las peticiones a nuestro servidor
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
   
    // Con next continuamos al siguiente middleware o a la respuesta
    next();
}


// Middleware de ruta -> Se aplica a rutas especificas
const validateId = (req, res, next) => {

    console.log("hola mundo")
    let { id } = req.params;

    // Nos aseguramos que el ID sea un numero (La consulta podria fallar o generar un error en la BBDD)
    if(!id || isNaN(Number(id))) {
        return res.status(400).json({
            message: "El id del producto debe ser un numero valido"
        })
    }

    // Convertimos el parametro id (originalmente un string porque viene de la URL) a un numero entero (en base 10 decimal)
    req.id = parseInt(id, 10);

    console.log("Id validado: ", req.id);
    next();
}

// Middleware para medir el tiempo de respuesta de cada endpoint
function medirTiempo(req, res, next) {
    // Guarda el tiempo inicial en milisegundos
    const inicio = Date.now();

    // Cuando la respuesta termine, calcular duración
    res.on("finish", () => {
        const fin = Date.now();
        const duracion = fin - inicio;

        console.log(
            `[${req.method}] ${req.originalUrl} - ${duracion}ms`
        );
    });

    next();
}

export {
    loggerUrl,
    validateId,
    medirTiempo
}