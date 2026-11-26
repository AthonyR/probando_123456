import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { TOKEN_KEY } from '../api'

export default function ProtectedLayout() {
  const navigate = useNavigate()
  if (!localStorage.getItem(TOKEN_KEY)) return <Navigate to="/login" replace />

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-4">
        <Link className="font-bold text-slate-900 no-underline" to="/dashboard">SalaEstudio</Link>
        <Link to="/my-bookings">Mis reservas</Link>
        <button className="button" onClick={logout}>Cerrar sesión</button>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
