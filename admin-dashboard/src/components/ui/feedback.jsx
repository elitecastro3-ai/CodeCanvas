import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { Button, Modal } from './index.jsx'

/* Toasts + promise-based confirm dialog, replacing window.alert / window.confirm */
const FeedbackContext = createContext(null)

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [dialog, setDialog] = useState(null)
  const id = useRef(0)

  const dismiss = useCallback((t) => setToasts((ts) => ts.filter((x) => x.id !== t)), [])
  const push = useCallback((tone, message) => {
    const t = ++id.current
    setToasts((ts) => [...ts.slice(-3), { id: t, tone, message }])
    setTimeout(() => dismiss(t), tone === 'error' ? 7000 : 4000)
  }, [dismiss])

  const toast = useRef({
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  }).current

  const confirm = useCallback((opts) => new Promise((resolve) => setDialog({ ...opts, resolve })), [])
  const close = (result) => { dialog.resolve(result); setDialog(null) }

  const ICON = { success: CheckCircle2, error: AlertCircle, info: Info }
  const TONE = { success: 'text-emerald-300', error: 'text-red-300', info: 'text-brand-400' }

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="fixed z-[80] bottom-4 left-4 right-4 sm:left-auto sm:w-96 flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICON[t.tone]
          return (
            <div key={t.id} role={t.tone === 'error' ? 'alert' : 'status'}
              className="pop pointer-events-auto flex items-start gap-3 bg-ink-850 border border-line-strong rounded-[12px] px-4 py-3 shadow-xl">
              <Icon size={18} className={`mt-0.5 shrink-0 ${TONE[t.tone]}`} aria-hidden="true" />
              <p className="text-sm flex-1">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-muted hover:text-white -mr-1"><X size={16} /></button>
            </div>
          )
        })}
      </div>
      {dialog && (
        <Modal size="sm" title={dialog.title} onClose={() => close(false)}
          footer={<>
            <Button variant="secondary" onClick={() => close(false)}>Cancel</Button>
            <Button variant={dialog.danger ? 'dangerSolid' : 'primary'} onClick={() => close(true)} data-autofocus>{dialog.confirmLabel || 'Confirm'}</Button>
          </>}>
          <p className="text-sm text-soft">{dialog.message}</p>
        </Modal>
      )}
    </FeedbackContext.Provider>
  )
}

export const useFeedback = () => useContext(FeedbackContext)
