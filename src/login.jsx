import { useState } from 'react'
import './App.css'

function App() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  // 🔗 Usa la URL de tu backend (cuando lo subas)
const API_URL = 'https://tu-proyecto.vercel.app/api'



  // --- Registrar usuario ---
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')

    try {
      const res = await fetch(`${API_URL}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setMsg('✅ Usuario registrado correctamente')
        setNombre('')
        setCorreo('')
        setPassword('')
      } else {
        setError(data.error || 'Error al registrar usuario')
      }
    } catch (err) {
      setError('⚠️ Error al conectar con el servidor')
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
          <h2>Registro de usuario</h2>
          <p className="subtitle">Guarda nuevos usuarios en la base de datos</p>

          <form onSubmit={handleRegister}>
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <label>Correo</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
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

            <button type="submit">Registrar usuario</button>
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
