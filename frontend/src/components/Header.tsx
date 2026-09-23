import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "pill bg-primary text-white"
    : "pill text-on-surface-variant hover:bg-surface-container-high";

export default function Header() {
  const { user } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-container-high/70 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-lg">
            🍔
          </span>
          <span className="text-lg font-extrabold text-primary">FreshBites</span>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/foods" className={navLinkClass}>
            All Foods
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            <span className="flex items-center gap-1.5">
              Cart
              {itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </span>
          </NavLink>
          <Link
            to={user ? "/account" : "/login"}
            className="ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-semibold text-on-surface hover:bg-surface-container-high"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-secondary">
              {user ? user.firstName[0] : <span className="material-symbol !text-base">person</span>}
            </span>
            {user ? user.firstName : "Account"}
          </Link>
        </nav>

        <Link to="/cart" className="relative sm:hidden">
          <span className="material-symbol">shopping_cart</span>
          {itemCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
