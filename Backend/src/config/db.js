import mysql2 from "mysql2/promise.js"; 

import {database} from "../config/enviroment.js";

const connection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;
