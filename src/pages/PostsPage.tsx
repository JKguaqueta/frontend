import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchJson } from '../api';
import { config } from '../config';
import { useAuth } from '../auth/AuthContext';
import { NavBar } from '../components/NavBar';

type Post = {
  id: string;
  message: string;
  createdAt: string;
  author: { id: string; alias: string; firstName: string; lastName: string };
  likeCount: number;
};

export function PostsPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  useEffect(() => {
    const run = async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await fetchJson<Post[]>(`${config.postsBaseUrl}/posts`, {
          headers: authHeaders,
        });
        setPosts(data);
      } catch {
        setError('No fue posible cargar publicaciones');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [authHeaders]);

  useEffect(() => {
    const socket: Socket = io(`${config.postsBaseUrl}/likes`, {
      transports: ['websocket'],
      auth: token ? { token } : undefined,
    });

    socket.on('likeUpdated', (payload: { postId: string; likeCount: number }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === payload.postId ? { ...p, likeCount: payload.likeCount } : p,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 900, margin: '24px auto', padding: 16 }}>
        <h2>Publicaciones</h2>

        <div style={{ marginBottom: 16, padding: 12, border: '1px solid #ddd' }}>
          <h3>Crear publicación</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                await fetchJson(`${config.postsBaseUrl}/posts`, {
                  method: 'POST',
                  headers: authHeaders,
                  body: JSON.stringify({ message }),
                });
                setMessage('');
              } catch {
                setError('No fue posible crear la publicación');
              }
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                style={{ flex: 1, padding: 8 }}
              />
              <button type="submit" disabled={!message.trim()}>
                Publicar
              </button>
            </div>
          </form>
        </div>

        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        {loading ? <div>Cargando...</div> : null}

        <div style={{ display: 'grid', gap: 12 }}>
          {posts.map((post) => (
            <div key={post.id} style={{ border: '1px solid #ddd', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <b>
                  {post.author.alias} ({post.author.firstName} {post.author.lastName})
                </b>
                <div style={{ opacity: 0.7 }}>
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ marginTop: 8 }}>{post.message}</div>

              <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await fetchJson<{ postId: string; likeCount: number }>(
                        `${config.postsBaseUrl}/posts/${post.id}/like`,
                        { method: 'POST', headers: authHeaders },
                      );

                      setPosts((prev) =>
                        prev.map((p) =>
                          p.id === result.postId ? { ...p, likeCount: result.likeCount } : p,
                        ),
                      );
                    } catch {
                      setError('No fue posible dar like');
                    }
                  }}
                >
                  Like
                </button>

                <div>
                  <b>Likes:</b> {post.likeCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
