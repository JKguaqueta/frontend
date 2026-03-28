import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to='/profile'>Perfil</Link>
      <Link to='/posts'>Publicaciones</Link>
      <button onClick={() => { logout(); navigate('/'); }}>Salir</button>
    </div>
  );
}
