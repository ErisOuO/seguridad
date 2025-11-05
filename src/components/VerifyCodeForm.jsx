import { useState } from 'react';

export default function VerifyCodeForm({ usuario }) {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, code }),
    });
    const data = await res.json();
    setMsg(data.error || data.message);
  };

  return (
    <div>
      <h5 className="text-center text-warning mb-3">Verificación de código</h5>
      <form onSubmit={handleVerify}>
        <div className="mb-3">
          <input
            className="form-control text-center"
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
          />
        </div>
        <button className="btn btn-warning w-100" type="submit">
          Verificar código
        </button>
      </form>

      {msg && (
        <div
          className={`alert mt-3 text-center ${
            msg.includes('exitosa') ? 'alert-success' : 'alert-danger'
          }`}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
