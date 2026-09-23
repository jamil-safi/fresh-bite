import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Icon from "../components/Icon";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="mt-6">
        <h3 className="text-lg font-bold">Welcome back!</h3>
        <p className="text-sm text-on-surface-variant">Enter your details to access your account.</p>

        <label className="mt-5 block text-sm font-semibold">Email Address</label>
        <div className="input-field mt-1.5 flex items-center gap-2">
          <Icon name="mail" className="!text-base text-on-surface-variant" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="text-sm font-semibold">Password</label>
          <a href="#" className="text-xs font-semibold text-primary">Forgot Password?</a>
        </div>
        <div className="input-field mt-1.5 flex items-center gap-2">
          <Icon name="lock" className="!text-base text-on-surface-variant" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent outline-none"
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)}>
            <Icon name={showPassword ? "visibility_off" : "visibility"} className="!text-base text-on-surface-variant" />
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>

        {error && <p className="mt-3 text-sm text-error">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? "Signing In…" : "Sign In"} <Icon name="arrow_forward" className="!text-base" />
        </button>

        <p className="mt-4 text-center text-xs text-on-surface-variant">
          Demo login: demo@freshbites.com / password123
        </p>
        <p className="mt-1 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
