import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Messages from "./pages/Messages";
import Media from "./pages/Media";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{display:"flex",height:"100vh",background:"#0F172A",overflow:"hidden",fontFamily:"'Poppins',sans-serif"}}>
      <Sidebar
  mobileOpen={sidebarOpen}
  setMobileOpen={setSidebarOpen}
/>
      {sidebarOpen && (
        <div
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:20}}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{flex:1,overflowY:"auto",padding:"24px"}}>
          <Routes>

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />

          <Route
            path="/testimonials"
            element={
              <ProtectedRoute>
                <Testimonials />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/media"
            element={
              <ProtectedRoute>
                <Media />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

        </Routes>
        </main>
      </div>
    </div>
  );
}