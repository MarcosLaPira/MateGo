// src/services/admin.service.js
import bcrypt from "bcryptjs";
import * as usuarioAdminRepository from "../repositories/usuarioAdmin.repository.js";

const SALT_ROUNDS = 10;

// Login de administrador
export async function loginAdmin(correo, contrasenaPlano) {
  if (!correo || !contrasenaPlano) {
    throw new Error("Correo y contraseña son obligatorios.");
  }

  const usuario = await usuarioAdminRepository.getByCorreo(correo);

  if (!usuario) {
    // No decimos "no existe" para no dar pistas  mensaje genérico
    throw new Error("Usuario o contraseña inválidos.");
  }

  const coincide = await bcrypt.compare(contrasenaPlano, usuario.contrasenaHash);

  if (!coincide) {
    throw new Error("Usuario o contraseña inválidos.");
  }

  // Si llegó acá, login OK  actualizamos último ingreso
  await usuarioAdminRepository.actualizarUltimoIngreso(usuario.idUsuarioAdministrador);

  // Devolvemos datos básicos (sin contraseña)
  return {
    idUsuarioAdministrador: usuario.idUsuarioAdministrador,
    correo: usuario.correo,
  };
}

// Crear un nuevo administrador (por si más adelante hacés alta de admins)
export async function crearAdmin(correo, contrasenaPlano) {
  if (!correo || !contrasenaPlano) {
    throw new Error("Correo y contraseña son obligatorios.");
  }

  // Verificar que no exista otro admin con ese correo
  const existente = await usuarioAdminRepository.getByCorreo(correo);
  if (existente) {
    throw new Error("Ya existe un administrador con ese correo.");
  }

  // Generar hash de la contraseña
  const contrasenaHash = await bcrypt.hash(contrasenaPlano, SALT_ROUNDS);

  const idUsuarioAdministrador = await usuarioAdminRepository.crearUsuario({
    correo,
    contrasenaHash,
  });

  return idUsuarioAdministrador;
}
