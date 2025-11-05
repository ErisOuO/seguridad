import { useState } from 'react';

export default function VerifyCodeForm({ usuario }) {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, code })
    });
    const data = await res.json();
    setMsg(data.error || data.message);
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verifica tu código</h2>
      <input placeholder="Código de 6 dígitos" value={code} onChange={e => setCode(e.target.value)} required />
      <button type="submit">Verificar</button>
      <p>{msg}</p>
    </form>
  );
}
