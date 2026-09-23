import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { checkoutRequest } from "../api/cart";
import Icon from "../components/Icon";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, loading, updateItem, removeItem, applyPromo } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Icon name="shopping_cart" className="!text-5xl text-on-surface-variant" />
        <h1 className="mt-4 text-headline-md">Sign in to view your cart</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Create an account or sign in to start adding delicious dishes to your cart.
        </p>
        <button onClick={() => navigate("/login")} className="btn-primary mt-6">
          Sign In
        </button>
      </div>
    );
  }

  async function handlePromo() {
    setPromoError("");
    try {
      await applyPromo(promoInput);
    } catch {
      setPromoError("Invalid or expired promo code");
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      await checkoutRequest(cart?.summary.promoCode);
      setOrderPlaced(true);
    } finally {
      setCheckingOut(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-secondary">
          <Icon name="check_circle" className="!text-4xl" />
        </span>
        <h1 className="mt-4 text-headline-md">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Your food is being prepared and will arrive hot and fresh in 20-30 minutes.
        </p>
        <button onClick={() => navigate("/foods")} className="btn-primary mt-6">
          Order More Food
        </button>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const summary = cart?.summary;
  const restaurantName = items[0]?.foodItem.restaurant.name ?? "Your Restaurant";
  const restaurantMeta = items[0]?.foodItem.restaurant;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Review &amp; Pay</p>
          <h1 className="text-headline-lg">Your Food Cart</h1>
        </div>
        {items.length > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
            <Icon name="local_shipping" className="!text-base" /> Estimated delivery in 20-30 mins
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-surface-container-high" />
      ) : items.length === 0 ? (
        <div className="mt-16 text-center text-on-surface-variant">
          <Icon name="shopping_cart" className="!text-5xl" />
          <p className="mt-4">Your cart is empty. Go explore some delicious dishes!</p>
          <button onClick={() => navigate("/foods")} className="btn-primary mt-6">
            Browse Food
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="card p-5">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/15 text-primary">
                    <Icon name="restaurant" className="!text-lg" />
                  </span>
                  <div>
                    <p className="font-bold">{restaurantName}</p>
                    <p className="text-xs text-on-surface-variant">
                      {restaurantMeta?.kitchen} • {restaurantMeta?.distanceMi} miles away
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-secondary">
                  {restaurantMeta?.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              <ul className="divide-y divide-surface-container-high">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    <img
                      src={item.foodItem.imageUrl}
                      alt={item.foodItem.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{item.foodItem.name}</p>
                      <p className="text-xs text-on-surface-variant">{item.foodItem.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-surface-container-high px-2 py-1 text-sm">
                          <button
                            onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                            className="h-5 w-5 font-bold"
                          >
                            −
                          </button>
                          <span className="w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="h-5 w-5 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-error"
                        >
                          <Icon name="delete" className="!text-sm" /> Remove
                        </button>
                      </div>
                    </div>
                    <span className="font-bold text-primary">
                      ${(Number(item.foodItem.price) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-surface-container-high p-1">
                <Icon name="local_offer" className="ml-2 text-on-surface-variant" />
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (e.g., FRESH20)"
                  className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
                />
                <button onClick={handlePromo} className="btn-secondary !px-4 !py-2 text-xs">
                  Apply
                </button>
              </div>
              {promoError && <p className="mt-2 text-xs text-error">{promoError}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h2 className="font-bold">Order Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-on-surface-variant">Subtotal</dt>
                  <dd>${summary?.subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-on-surface-variant">Delivery Fee</dt>
                  <dd>${summary?.deliveryFee.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-on-surface-variant">Estimated Tax</dt>
                  <dd>${summary?.tax.toFixed(2)}</dd>
                </div>
                {!!summary?.promoDiscount && (
                  <div className="flex justify-between text-secondary">
                    <dt>Promo Discount {summary.promoCode && `(${summary.promoCode})`}</dt>
                    <dd>-${summary.promoDiscount.toFixed(2)}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-surface-container-high pt-4">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-extrabold text-primary">${summary?.total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} disabled={checkingOut} className="btn-primary mt-5 w-full">
                {checkingOut ? "Placing Order…" : "Proceed to Secure Checkout"} <Icon name="arrow_forward" className="!text-base" />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs text-on-surface-variant">
                <Icon name="lock" className="!text-sm" /> Encrypted &amp; powered by Stripe Payments
              </p>
            </div>

            <div className="card flex gap-3 p-5 text-sm">
              <Icon name="info" className="text-primary" />
              <div>
                <p className="font-bold">Contactless Delivery</p>
                <p className="mt-1 text-on-surface-variant">
                  Your courier will leave your order at your door and ring the doorbell upon
                  arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
