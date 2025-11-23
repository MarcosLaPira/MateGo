// src/repositories/usuarioAdmin.repository.js
import connection from "../config/db.js";

// Traer usuario admin por correo
export async function getByCorreo(correo) {
  
  const [rows] = await connection.query(
    `SELECT idUsuarioAdministrador, correo, contrasenaHash, ultimoIngreso
     FROM usuarioadministrador
     WHERE correo = ?`,
    [correo]
  );

  return rows[0] || null; // null si no existe
}

// Crear un nuevo usuario administrador
export async function crearUsuario({ correo, contrasenaHash }) {
  const [result] = await connection.query(
    `INSERT INTO usuarioadministrador (correo, contrasenaHash, ultimoIngreso)
     VALUES (?, ?, NULL)`,
    [correo, contrasenaHash]
  );

  return result.insertId; // idUsuarioAdministrador
}

// Actualizar último ingreso
export async function actualizarUltimoIngreso(idUsuarioAdministrador) {
  await connection.query(
    `UPDATE usuarioadministrador
     SET ultimoIngreso = NOW()
     WHERE idUsuarioAdministrador = ?`,
    [idUsuarioAdministrador]
  );
}
