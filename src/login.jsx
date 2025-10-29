import { useState } from 'react'
import './App.css'

function App() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  // 🔗 URL de tu backend en Vercel - CAMBIA ESTA URL POR LA TUYA
  const API_URL = 'https://seguridad-git-cifrado-s-196ac5-erick-eduardos-projects-7505bdcd.vercel.app/api/usuarios';

  // --- Registrar usuario ---
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')

    // Validaciones básicas
    if (!nombre || !correo || !password) {
      setError('⚠️ Todos los campos son obligatorios')
      return
    }

    if (password.length < 6) {
      setError('⚠️ La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      console.log('📤 Enviando datos a:', API_URL)
      console.log('📝 Datos:', { nombre, correo, password })

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, password }),
      })

      console.log('📨 Respuesta status:', res.status)
      
      const data = await res.json()
      console.log('📨 Respuesta data:', data)

      if (res.ok) {
        setMsg('✅ Usuario registrado correctamente en la base de datos')
        setNombre('')
        setCorreo('')
        setPassword('')
        
        // Opcional: Mostrar los datos guardados
        setTimeout(() => {
          setMsg(`✅ Usuario: ${data.usuario.nombre} (${data.usuario.correo}) guardado en BD`)
        }, 1000)
        
      } else {
        setError(data.error || '❌ Error al registrar usuario')
      }
    } catch (err) {
      console.error('💥 Error completo:', err)
      setError('⚠️ Error al conectar con el servidor. Verifica la URL.')
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
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Crea una contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            {error && (
              <div className="alert error">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {msg && (
              <div className="alert success">
                <strong>Éxito:</strong> {msg}
              </div>
            )}

            <button type="submit" className="submit-btn">
              Registrar usuario
            </button>
          </form>

          <div className="footer">
            <p>
              soporte@empresa.com · +52 77 11 89 12 65
              <br />© 2025 Empresa — Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App