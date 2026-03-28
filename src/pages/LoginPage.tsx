import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <h2>Login</h2>
      <form onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          await login(username, password);
          navigate('/posts');
        } catch (err) {
          setError(err instanceof ApiError ? 'Credenciales inválidas o servicio no disponible' : 'Error inesperado');
        } finally {
          setLoading(false);
        }
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Usuario
            <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: 8 }} />
          </label>
          <label>Clave
            <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' style={{ width: '100%', padding: 8 }} />
          </label>
          <button type='submit' disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
          {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        </div>
      </form>
    </div>
  );
}
