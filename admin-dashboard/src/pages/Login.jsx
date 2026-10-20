import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { Button, Input } from '../components/ui/index.jsx'

export default function Login() {
  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (authLoading) return <div className="min-h-dvh grid place-items-center bg-ink-950"><Loader2 size={24} className="spin text-brand-400" /></div>
  if (session) return <Navigate to="/dashboard" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (err) {
      setError(/invalid login/i.test(err.message) ? 'That email and password don’t match. Please try again.' : err.message)
      setBusy(false)
      return
    }
    navigate(location.state?.from && location.state.from !== '/login' ? location.state.from : '/dashboard', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-ink-950 grid place-items-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="" width="84" height="58" className="w-[84px] h-auto mb-5" />
          <h1 className="text-3xl font-extrabold">Code<span className="text-brand-500">Canvas</span></h1>
          <p className="label-mono text-gold mt-2">Admin sign in</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="bg-ink-900 border border-line-strong rounded-[16px] p-6 sm:p-7 space-y-5">
          <Input label="Email" type="email" autoComplete="username" inputMode="email" placeholder="you@example.com" required
            value={email} onChange={(e) => setEmail(e.target.value)} data-autofocus />
          <div>
            <div className="relative">
              <Input label="Password" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" required
                value={password} onChange={(e) => setPassword(e.target.value)} className="[&_input]:pr-12" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-1 bottom-[2px] w-11 h-11 grid place-items-center text-muted hover:text-white">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-red-300 border border-red-400/30 bg-red-500/5 rounded-[10px] px-3.5 py-2.5">{error}</p>}

          <Button type="submit" loading={busy} disabled={!email || !password} className="w-full">{busy ? 'Signing in…' : 'Sign in'}</Button>
        </form>

        <p className="text-center text-xs text-muted mt-6">Authorised access only.</p>
      </div>
    </div>
  )
}
