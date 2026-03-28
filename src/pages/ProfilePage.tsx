import { useEffect, useState } from 'react';
import { fetchJson } from '../api';
import { config } from '../config';
import { useAuth } from '../auth/AuthContext';
import { NavBar } from '../components/NavBar';

type Profile = { id: string; username: string; firstName: string; lastName: string; birthDate: string; alias: string; };

export function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setError(null);
      try {
        const me = await fetchJson<Profile>(`${config.usersBaseUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(me);
      } catch {
        setError('No fue posible cargar el perfil');
      }
    };
    void run();
  }, [token]);

  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
        <h2>Perfil</h2>
        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        {!profile ? <div>Cargando...</div> : (
          <div style={{ display: 'grid', gap: 8 }}>
            <div><b>Usuario:</b> {profile.username}</div>
            <div><b>Nombre:</b> {profile.firstName} {profile.lastName}</div>
            <div><b>Alias:</b> {profile.alias}</div>
            <div><b>Fecha nacimiento:</b> {profile.birthDate}</div>
          </div>
        )}
      </div>
    </div>
  );
}
