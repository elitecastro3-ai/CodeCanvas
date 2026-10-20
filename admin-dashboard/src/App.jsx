import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Shell from './components/layout/Shell.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { FeedbackProvider } from './components/ui/feedback.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Services from './pages/Services.jsx'
import Testimonials from './pages/Testimonials.jsx'
import Messages from './pages/Messages.jsx'
import Media from './pages/Media.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Routes>
          {/* The login page stands alone: no sidebar or top bar */}
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute><Shell /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/media" element={<Media />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </FeedbackProvider>
    </AuthProvider>
  )
}
