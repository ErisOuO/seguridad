import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 className="text-center mb-4 fw-bold text-primary">
          {showRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
        </h2>

        {showRegister ? (
          <RegisterForm onToggle={() => setShowRegister(false)} />
        ) : (
          <LoginForm onToggle={() => setShowRegister(true)} />
        )}
      </div>
    </div>
  );
}
