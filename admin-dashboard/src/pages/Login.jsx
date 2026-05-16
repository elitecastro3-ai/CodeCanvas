import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // simple demo login
    if (
      email === "admin@codecanvas.com" &&
      password === "12345678"
    ) {
      localStorage.setItem("admin-auth", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-slate-900 border border-blue-500/20 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={28} />
          </div>

          <h1 className="text-2xl font-extrabold text-white">
            Admin Login
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Sign in to access CodeCanvas Admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Email
            </label>

            <div className="flex items-center gap-3 bg-slate-800 border border-blue-500/20 rounded-xl px-4 py-3">
              <Mail size={18} className="text-slate-500" />

              <input
                type="email"
                placeholder="admin@codecanvas.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Password
            </label>

            <div className="flex items-center gap-3 bg-slate-800 border border-blue-500/20 rounded-xl px-4 py-3">
              <Lock size={18} className="text-slate-500" />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-xl"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}