import type { InputHTMLAttributes } from 'react'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
}

export default function Field({ id, label, error, ...input }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block font-medium" htmlFor={id}>{label}</label>
      <input {...input} id={id} className="w-full rounded border border-slate-400 px-3 py-2 focus:outline-2 focus:outline-blue-600"
        aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  )
}
