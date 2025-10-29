import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../App.css';

function ValidarToken() {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!token) {
      setError('Token no válido');
      return;
    }

    fetch(`${API_URL}/api/auth/validar-enlace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if (data.sessionToken) {
        setMensaje('¡Acceso confirmado! Bienvenido.');
      } else {
        setError(data.message || 'Error al validar');
      }
    })
    .catch(() => setError('Error de conexión'));
  }, [token]);

  return (
    <div className="login-container">
      <div className="right-side" style={{ width: '100%' }}>
        <div className="login-box">
          <h2>Validando acceso...</h2>
          {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ValidarToken;