import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Loader2, Trees } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("facility@demo.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen nature-bg leaf-watermark relative flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white mb-4 shadow-lg shadow-emerald-600/30">
            <Trees className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold text-emerald-950 tracking-tight">Vasudha</h1>
          <p className="text-emerald-800/70 mt-1 text-sm">Green Habitat Energy Intelligence</p>
          <p className="text-xs text-emerald-700/50 mt-2 flex items-center justify-center gap-1">
            <Leaf className="w-3 h-3" /> Sustainable buildings · Comfort · Resilience
          </p>
        </div>

        <div className="card-nature rounded-2xl shadow-xl shadow-emerald-900/5 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-emerald-900/80 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-emerald-200/80 bg-white/80 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-900/80 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-emerald-200/80 bg-white/80 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                required
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 disabled:opacity-60 text-white font-medium py-2.5 transition shadow-md shadow-emerald-700/20"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in…" : "Enter Vasudha"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-emerald-100">
            <p className="text-xs text-emerald-800/50 text-center mb-2">Demo access</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button type="button" onClick={() => { setEmail("facility@demo.com"); setPassword("demo123"); }}
                className="rounded-lg bg-emerald-50 hover:bg-emerald-100 px-3 py-2 text-emerald-800 transition">Facility Manager</button>
              <button type="button" onClick={() => { setEmail("tenant@demo.com"); setPassword("demo123"); }}
                className="rounded-lg bg-emerald-50 hover:bg-emerald-100 px-3 py-2 text-emerald-800 transition">Tenant</button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-emerald-800/40 mt-6">
          Prem Jain Memorial Trust · NGEC Sustainable Habitat
        </p>
      </div>
    </div>
  );
};
