import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../lib/auth.jsx'

/** Only renders its children when there is a real, valid Supabase session. */
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-ink-950" role="status" aria-label="Loading">
        <Loader2 size={24} className="spin text-brand-400" />
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
