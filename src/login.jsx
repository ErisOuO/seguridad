import { useState } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  // --- Iniciar sesión ---
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: user, password }),
      })

      const data = await res.json()
      if (res.ok) {
        alert('Inicio de sesión exitoso ✅')
      } else {
        setError(data.error || 'Error en inicio de sesión')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
    }
  }

  // --- Registrar usuario ---
  const handleRegister = async () => {
    setError('')
    setMsg('')
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: user, password }),
      })

      const data = await res.json()
      if (res.ok) setMsg(data.message)
      else setError(data.error || 'Error al registrar')
    } catch (err) {
      setError('Error al conectar con el servidor')
    }
  }

  return (
    <div className="login-container">
      <div className="left-side">
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
          alt="logo"
          className="logo-large"
        />
      </div>

      <div className="right-side">
        <div className="login-box">
          <h2>Iniciar sesión</h2>
          <p className="subtitle">Acceso exclusivo para empleados autorizados</p>

          <form onSubmit={handleLogin}>
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error">{error}</p>}
            {msg && <p className="success">{msg}</p>}

            <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>

            <button type="submit">Iniciar sesión</button>
            <button type="button" onClick={handleRegister}>Registrar usuario</button>
          </form>

          <p className="footer">
            soporte@empresa.com · +52 77 11 89 12 65
            <br />© 2025 Empresa — Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
