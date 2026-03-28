export const config = {
  authBaseUrl: (import.meta.env.VITE_AUTH_URL as string | undefined) ?? 'http://localhost:3001',
  usersBaseUrl: (import.meta.env.VITE_USERS_URL as string | undefined) ?? 'http://localhost:3002',
  postsBaseUrl: (import.meta.env.VITE_POSTS_URL as string | undefined) ?? 'http://localhost:3003',
};
