import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-surface-container-high bg-surface-container-high/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🍴</span>
            <span className="text-lg font-extrabold text-primary">FreshBites</span>
          </div>
          <p className="mt-3 text-sm text-on-surface-variant">
            Fresh cravings, delivered hot to your door. Discover top-rated local restaurants and
            gourmet street food.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/foods" className="hover:text-primary">All Foods</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
            <li><Link to="/login" className="hover:text-primary">Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
            <li>Help Center</li>
            <li>Safety &amp; Hygiene</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold">Contact Us</h4>
          <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
            <li>support@freshbites.com</li>
            <li>1-800-FRESHBITES</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-surface-container-high py-5 text-center text-xs text-on-surface-variant">
        © {new Date().getFullYear()} FreshBites Inc. All rights reserved.
      </div>
    </footer>
  );
}
