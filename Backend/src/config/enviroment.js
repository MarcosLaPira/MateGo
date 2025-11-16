
import dotenv from "dotenv";

dotenv.config();

export const server = {
    port: process.env.SERV_PORT || 3000,
    url: process.env.SERV_URL
}

export const database = {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 3100,
};
