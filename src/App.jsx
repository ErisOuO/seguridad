import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function App() {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Autenticación con PIN 2FA</h1>
      <LoginForm />
      <hr />
      <RegisterForm />
    </div>
  );
}
