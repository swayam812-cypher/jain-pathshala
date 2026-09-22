import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || t("genericError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-maroon text-cream font-display text-2xl">ॐ</span>
          <h1 className="font-display text-2xl text-slate">{t("appName")}</h1>
          <p className="mt-1 text-sm text-slate/50">{t("signInSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-black/5 bg-white p-6 shadow-sm">
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate/60">{t("email")}</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-maroon"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate/60">{t("passwordLabel")}</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-maroon"
              placeholder="••••••••"
            />
          </div>
          <button disabled={busy} type="submit"
            className="w-full rounded-full bg-maroon py-2.5 text-sm font-medium text-white transition hover:bg-maroon-dark disabled:opacity-60">
            {busy ? t("signingIn") : t("signIn")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate/60">
          {t("newHere")} <Link to="/signup" className="text-maroon hover:underline">{t("createAccount")}</Link>
        </p>
      </div>
    </div>
  );
}
