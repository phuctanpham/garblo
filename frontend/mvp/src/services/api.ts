import axios from 'axios'

// In dev, Vite proxies /api and /uploads to localhost:3001.
// In prod, set VITE_API_URL to override (e.g. https://api.example.com).
export const API_BASE = import.meta.env.VITE_API_URL ?? ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
})

// Resolve image URLs returned by the backend (/uploads/... or full S3 URL)
export function resolveImageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

export default api
