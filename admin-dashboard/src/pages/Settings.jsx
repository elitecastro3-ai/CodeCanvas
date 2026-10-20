import { useState } from 'react'
import { CheckCircle2, CircleDashed, Copy, LogOut, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { useColumnProbe } from '../lib/useTable'
import { errorText, formatDate } from '../lib/format'
import { useFeedback } from '../components/ui/feedback.jsx'
import { Button, Card, Input, PageHeader } from '../components/ui/index.jsx'

const SQL = `-- Run once in Supabase > SQL Editor. Only ADDS columns; existing data is untouched.

-- 1) Remember which messages you've read, on every device
alter table public.messages
  add column if not exists read boolean not null default false;

-- 2) Optional case-study fields for portfolio projects
alter table public.portfolio
  add column if not exists client   text,
  add column if not exists year     text,
  add column if not exists problem  text,
  add column if not exists solution text,
  add column if not exists result   text,
  add column if not exists gallery  text;`

function Status({ ok, label, note }) {
  return (
    <li className="flex items-start gap-3 py-3">
      {ok === null ? <Loader2 size={18} className="spin text-muted mt-0.5" aria-hidden="true" />
        : ok ? <CheckCircle2 size={18} className="text-emerald-300 mt-0.5 shrink-0" aria-hidden="true" />
        : <CircleDashed size={18} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />}
      <div><p className="text-sm font-semibold">{label} <span className="font-normal text-muted">· {ok === null ? 'checking' : ok ? 'ready' : 'not set up'}</span></p><p className="text-[13px] text-muted">{note}</p></div>
    </li>
  )
}

export default function Settings() {
  const { session, signOut } = useAuth()
  const { toast } = useFeedback()
  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const readCol = useColumnProbe('messages', 'read')
  const caseCol = useColumnProbe('portfolio', 'problem')
  const user = session?.user

  async function changePassword(e) {
    e.preventDefault()
    const next = {}
    if (pw.next.length < 8) next.next = 'Use at least 8 characters.'
    if (pw.confirm !== pw.next) next.confirm = 'The two passwords don’t match.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pw.next })
    setSaving(false)
    if (error) { console.error(error); toast.error(`Couldn’t change the password: ${errorText(error)}`); return }
    setPw({ next: '', confirm: '' })
    toast.success('Password changed.')
  }

  async function copySql() {
    try { await navigator.clipboard.writeText(SQL); toast.success('SQL copied. Paste it into the Supabase SQL Editor and run it.') }
    catch { toast.error('Couldn’t copy automatically. Select the text and copy it by hand.') }
  }

  return (
    <>
      <PageHeader title="Settings" description="Your account and a quick check that everything the admin relies on is set up." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        <Card className="p-5 sm:p-6">
          <h3 className="font-bold text-lg mb-4">Account</h3>
          <dl className="space-y-3 text-sm">
            <div><dt className="label-mono text-muted mb-0.5">Email</dt><dd className="[overflow-wrap:anywhere]">{user?.email || '—'}</dd></div>
            {user?.last_sign_in_at && <div><dt className="label-mono text-muted mb-0.5">Last sign-in</dt><dd>{formatDate(user.last_sign_in_at)}</dd></div>}
          </dl>
          <Button variant="secondary" icon={LogOut} className="mt-5" onClick={signOut}>Sign out</Button>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="font-bold text-lg mb-4">Change password</h3>
          <form onSubmit={changePassword} noValidate className="space-y-4">
            <Input label="New password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} error={errors.next} />
            <Input label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} error={errors.confirm} />
            <Button type="submit" loading={saving}>{saving ? 'Saving…' : 'Update password'}</Button>
          </form>
        </Card>

        <Card className="p-5 sm:p-6 lg:col-span-2">
          <h3 className="font-bold text-lg">Setup</h3>
          <p className="text-sm text-muted mt-1">Optional database upgrades. The admin works without them and switches the features on once they’re in place.</p>
          <ul className="divide-y divide-line mt-3">
            <Status ok={readCol} label="Read / unread messages" note="Remembers read messages on every device. Without it, read state is kept only in this browser." />
            <Status ok={caseCol} label="Case-study fields" note="Lets you write a problem, solution and result for a project, which powers the case-study pages on your site." />
          </ul>
          {(readCol === false || caseCol === false) && (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-sm font-semibold">SQL to run</p>
                <Button variant="secondary" size="sm" icon={Copy} onClick={copySql}>Copy SQL</Button>
              </div>
              <pre className="overflow-x-auto rounded-[10px] bg-ink-1000 border border-line p-4 text-[12.5px] leading-relaxed font-mono text-soft">{SQL}</pre>
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
