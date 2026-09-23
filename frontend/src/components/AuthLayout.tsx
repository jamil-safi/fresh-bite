import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/signup";

  return (
    <div className="mx-auto flex max-w-4xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-card-md md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary to-[#ff5722] p-8 text-white md:flex">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl">🍴</span>
              <span className="text-lg font-extrabold">FreshBites</span>
            </Link>
            <h2 className="mt-8 text-2xl font-extrabold leading-snug">
              Delicious food, delivered instantly.
            </h2>
            <p className="mt-3 text-sm text-white/90">
              Sign in to access your saved favorite restaurants, lightning-fast reordering, and
              exclusive culinary rewards.
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
                <Icon name="local_shipping" className="!text-lg" />
              </span>
              <div>
                <p className="text-sm font-bold">Live Order Tracking</p>
                <p className="text-xs text-white/80">From our kitchen to your doorstep in 25 mins.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-2 rounded-full bg-surface-container-high p-1 text-sm font-bold">
            <button
              onClick={() => navigate("/login")}
              className={`rounded-full py-2 ${!isSignup ? "bg-white shadow" : "text-on-surface-variant"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={`rounded-full py-2 ${isSignup ? "bg-white shadow" : "text-on-surface-variant"}`}
            >
              Create Account
            </button>
          </div>

          {children}

          <div className="mt-6 flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="h-px flex-1 bg-surface-container-high" /> or continue with{" "}
            <span className="h-px flex-1 bg-surface-container-high" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-secondary">
              <Icon name="public" className="!text-base" /> Google
            </button>
            <button className="btn-secondary">
              <Icon name="phone_iphone" className="!text-base" /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
