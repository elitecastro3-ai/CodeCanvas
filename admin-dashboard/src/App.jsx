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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{display:"flex",height:"100vh",background:"#0F172A",overflow:"hidden",fontFamily:"'Poppins',sans-serif"}}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"    element={<Dashboard />} />
            <Route path="/portfolio"    element={<Portfolio />} />
            <Route path="/services"     element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/messages"     element={<Messages />} />
            <Route path="/media"        element={<Media />} />
            <Route path="/analytics"    element={<Analytics />} />
            <Route path="/settings"     element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}