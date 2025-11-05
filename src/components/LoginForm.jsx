import { useState } from 'react';
import VerifyCodeForm from './VerifyCodeForm';

export default function LoginForm() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [msg, setMsg] = useState('');
  const [verifiedStep, setVerifiedStep] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena })
    });
    const data = await res.json();
    if (data.success) setVerifiedStep(true);
    setMsg(data.error || '');
  };

  if (verifiedStep) return <VerifyCodeForm usuario={usuario} />;

  return (
    <form onSubmit={handleLogin}>
      <h2>Inicio de sesión</h2>
      <input placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} required />
      <input placeholder="Contraseña" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} required />
      <button type="submit">Iniciar sesión</button>
      <p>{msg}</p>
    </form>
  );
}