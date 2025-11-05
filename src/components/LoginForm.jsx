import { useState } from 'react';
import VerifyCodeForm from './VerifyCodeForm';

export default function LoginForm({ onToggle }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [msg, setMsg] = useState('');
  const [verifiedStep, setVerifiedStep] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena }),
    });
    const data = await res.json();
    if (data.success) setVerifiedStep(true);
    setMsg(data.error || '');
  };

  if (verifiedStep) return <VerifyCodeForm usuario={usuario} />;

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            className="form-control"
            placeholder="Tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            className="form-control"
            type="password"
            placeholder="Tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">
          Iniciar sesión
        </button>

        <p className="text-center text-muted mb-0">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={onToggle}
          >
            Regístrate aquí
          </button>
        </p>

        {msg && <div className="alert alert-danger mt-3 text-center">{msg}</div>}
      </form>
    </>
  );
}
