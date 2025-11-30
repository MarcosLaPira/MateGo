import dotenv from "dotenv";

dotenv.config();

export const server = {
    // Puerto donde corre el servidor (si no existe la variable, usa 3000 por defecto)
    port: process.env.SERV_PORT || 3000,

    url: process.env.SERV_URL
};

export const database = {
    // Host del motor de base de datos (ej: localhost o una IP remota)
    host: process.env.DB_HOST,

    // Nombre de la base de datos a utilizar
    name: process.env.DB_NAME,

    // Usuario con acceso a la base
    user: process.env.DB_USER,

    // Password correspondiente al usuario configurado
    password: process.env.DB_PASS,

    // Puerto del motor de base
    port: process.env.DB_PORT || 3100,
};
