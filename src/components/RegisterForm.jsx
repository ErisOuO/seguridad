import { useState } from 'react';

export default function RegisterForm({ onToggle }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena, email }),
    });
    const data = await res.json();
    setMsg(data.error || 'Registro exitoso');
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            className="form-control"
            placeholder="Elige un usuario"
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
            placeholder="Crea una contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            className="form-control"
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mb-3">
          Registrarme
        </button>

        <p className="text-center text-muted mb-0">
          ¿Ya tienes una cuenta?{' '}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={onToggle}
          >
            Inicia sesión
          </button>
        </p>

        {msg && (
          <div
            className={`alert mt-3 text-center ${
              msg.includes('exitoso') ? 'alert-success' : 'alert-danger'
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </>
  );
}
