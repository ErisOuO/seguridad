import { useState } from 'react';

export default function RegisterForm() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena, email })
    });
    const data = await res.json();
    setMsg(data.error || 'Registro exitoso');
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>
      <input placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} required />
      <input placeholder="Contraseña" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} required />
      <input placeholder="Correo electrónico" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit">Registrar</button>
      <p>{msg}</p>
    </form>
  );
}