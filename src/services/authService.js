import sql from './db';
import { sendVerificationCode } from './mailService';

// Función para registrar usuario
export async function registerUser(usuario, contrasena, email) {
  const existing = await sql`SELECT * FROM tblusuarios WHERE usuario = ${usuario}`;
  if (existing.length > 0) throw new Error('El usuario ya existe');

  await sql`
    INSERT INTO tblusuarios (usuario, contrasena, email, verified)
    VALUES (${usuario}, ${contrasena}, ${email}, false)
  `;

  return { success: true };
}

// Función para iniciar sesión (primer paso)
export async function loginUser(usuario, contrasena) {
  const user = await sql`SELECT * FROM tblusuarios WHERE usuario = ${usuario} AND contrasena = ${contrasena}`;
  if (user.length === 0) throw new Error('Usuario o contraseña incorrectos');

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiration = new Date(Date.now() + 3 * 60 * 1000); // +3 minutos

  await sql`
    UPDATE tblusuarios 
    SET code = ${code}, expiracion = ${expiration}
    WHERE id = ${user[0].id}
  `;

  await sendVerificationCode(user[0].email, code);

  return { success: true, email: user[0].email };
}

// Función para verificar el código
export async function verifyCode(usuario, code) {
  const result = await sql`
    SELECT * FROM tblusuarios WHERE usuario = ${usuario} AND code = ${code}
  `;

  if (result.length === 0) throw new Error('Código incorrecto');

  const user = result[0];
  const now = new Date();
  if (new Date(user.expiracion) < now) throw new Error('Código expirado');

  await sql`
    UPDATE tblusuarios
    SET verified = true, code = NULL, expiracion = NULL
    WHERE id = ${user.id}
  `;

  return { success: true, usuario: user.usuario };
}
