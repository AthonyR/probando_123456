import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api, errorMessage, TOKEN_KEY } from '../api'
import Field from '../components/Field'

type AuthPageProps = { register?: boolean }
type Errors = { name?: string; email?: string; password?: string }

export default function AuthPage({ register = false }: AuthPageProps) {
  const navigate = useNavigate()
  const [search] = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    const next: Errors = {}
    if (register && (!name.trim() || name.trim().length > 100)) next.name = 'Escribe un nombre de 1 a 100 caracteres.'
    if (email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Escribe un correo válido de hasta 254 caracteres.'
    if (!password) next.password = 'Escribe tu contraseña.'
    else if (register && (password.length < 8 || password.length > 72)) next.password = 'Usa de 8 a 72 caracteres.'
    setErrors(next)
    setMessage('')
    if (Object.keys(next).length) return

    setSending(true)
    try {
      if (register) {
        await api.post('/auth/register', { name: name.trim(), email: email.trim(), password })
        navigate('/login?registered=1', { replace: true })
      } else {
        const { data } = await api.post<{ token: string }>('/auth/login', { email: email.trim(), password })
        localStorage.setItem(TOKEN_KEY, data.token)
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) setMessage('Correo o contraseña incorrectos.')
      else if (register && axios.isAxiosError(error) && error.response?.status === 409) setErrors({ email: 'Este correo ya está registrado.' })
      else setMessage(errorMessage(error))
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-5 p-6 sm:mt-12">
      <p className="font-medium text-slate-600">SalaEstudio</p>
      <h1 className="text-2xl font-bold">{register ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
      {!register && search.has('registered') && <p role="status" className="text-green-800">Cuenta creada. Inicia sesión.</p>}
      {!register && search.has('expired') && <p role="status">Tu sesión venció. Vuelve a iniciar sesión.</p>}
      <form noValidate onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {register && <Field id="name" label="Nombre" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />}
        <Field id="email" label="Correo" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
        <Field id="password" label="Contraseña" type="password" autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
        {message && <p role="alert" className="text-red-700">{message}</p>}
        <button className="button w-full" disabled={sending}>{sending ? 'Enviando…' : register ? 'Registrarme' : 'Entrar'}</button>
      </form>
      <Link to={register ? '/login' : '/register'}>{register ? 'Ya tengo cuenta. Iniciar sesión' : 'Crear una cuenta'}</Link>
    </main>
  )
}
