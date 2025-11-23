
import bcrypt from "bcryptjs";
//import connection from "../src/config/db.js";
import connection from "../../src/config/db.js";

const correo = "root@gmail.com";
const contrasenaPlano = "root";
const SALT_ROUNDS = 10;

async function run() {
    
  const contrasenaHash = await bcrypt.hash(contrasenaPlano, SALT_ROUNDS);
  console.log("Hash generado:", contrasenaHash);

  const [result] = await connection.query(
    `INSERT INTO usuarioadministrador (correo, contrasenaHash, ultimoIngreso)
     VALUES (?, ?, NULL)`,
    [correo, contrasenaHash]
  );

  console.log("Admin creado con id:", result.insertId);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
