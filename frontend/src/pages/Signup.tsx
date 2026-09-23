import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Icon from "../components/Icon";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      await signup({ firstName, lastName, email, password });
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="mt-6">
        <h3 className="text-lg font-bold">Create an Account</h3>
        <p className="text-sm text-on-surface-variant">Join FreshBites and get free delivery on your first 3 orders.</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold">First Name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="input-field mt-1.5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Last Name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="input-field mt-1.5"
            />
          </div>
        </div>

        <label className="mt-4 block text-sm font-semibold">Email Address</label>
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

        <label className="mt-4 block text-sm font-semibold">Password</label>
        <div className="input-field mt-1.5 flex items-center gap-2">
          <Icon name="lock" className="!text-base text-on-surface-variant" />
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full bg-transparent outline-none"
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)}>
            <Icon name={showPassword ? "visibility_off" : "visibility"} className="!text-base text-on-surface-variant" />
          </button>
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            I agree to the <a href="#" className="font-semibold text-primary">Terms of Service</a> &amp;{" "}
            <a href="#" className="font-semibold text-primary">Privacy Policy</a>
          </span>
        </label>

        {error && <p className="mt-3 text-sm text-error">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? "Creating Account…" : "Create Account"} <Icon name="arrow_forward" className="!text-base" />
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
