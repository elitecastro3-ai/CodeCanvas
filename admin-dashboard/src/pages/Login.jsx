import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";
import { supabase } from '../lib/supabase'; // adjust path if needed

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // save auth state
      localStorage.setItem("admin-auth", "true");

      console.log("Logged in:", data.user);

      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-slate-900 border border-blue-500/20 rounded-3xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Lock className="text-white" size={28} />
          </div>

          <h1 className="text-2xl font-extrabold text-white">
            Admin Login
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Sign in to access CodeCanvas Admin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Email
            </label>

            <div className="flex items-center gap-3 bg-slate-800 border border-blue-500/20 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <Mail size={18} className="text-slate-500" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent outline-none text-white w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Password
            </label>

            <div className="flex items-center gap-3 bg-slate-800 border border-blue-500/20 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <Lock size={18} className="text-slate-500" />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent outline-none text-white w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}