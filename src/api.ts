import axios from 'axios'

export const TOKEN_KEY = 'token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://salaestudio-api.aaron-navarro.workers.dev/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token && !config.url?.startsWith('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401
      && !error.config?.url?.startsWith('/auth/')) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.replace('/login?expired=1')
    }
    return Promise.reject(error)
  },
)

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
    if (error.response.status === 404) return 'No se encontró el registro solicitado.'
    if (error.response.status === 400) return error.response.data?.message || 'Revisa los datos ingresados.'
    if (error.response.status === 409) return 'La operación no pudo completarse porque los datos cambiaron.'
  }
  return 'Ocurrió un error. Inténtalo de nuevo.'
}
