// In local dev, requests to /api/* are proxied to the local server (see
// vite.config.js), so a relative path works. In production the frontend
// (Netlify) and API server (Railway) live on different domains, so we need
// the absolute server URL instead. Override with VITE_API_URL if the server
// ever moves.
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://codelingo-production.up.railway.app')
