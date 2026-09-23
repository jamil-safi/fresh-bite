import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchFeaturedFoods } from "../api/food";
import { Category, FoodItem } from "../types";
import FoodCard from "../components/FoodCard";
import CategoryIcon from "../components/CategoryIcon";
import Icon from "../components/Icon";

const STEPS = [
  {
    step: "Step 01",
    icon: "restaurant",
    title: "Choose Your Meal",
    desc: "Browse top curated menus and pick your favorite dishes from chef-partnered restaurants.",
  },
  {
    step: "Step 02",
    icon: "local_shipping",
    title: "Fast & Fresh Delivery",
    desc: "Track your food in real time as our courier delivers it piping hot in under 30 minutes.",
  },
  {
    step: "Step 03",
    icon: "storefront",
    title: "Enjoy & Savor",
    desc: "Relish gourmet flavors in the comfort of your home with friends and family.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchFeaturedFoods()])
      .then(([cats, foods]) => {
        setCategories(cats);
        setFeatured(foods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleExplore() {
    navigate(query ? `/foods?search=${encodeURIComponent(query)}` : "/foods");
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-container/10 via-surface to-secondary-container/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-bold text-secondary">
              <Icon name="bolt" className="!text-sm" /> Lightning Fast Delivery in 30 Mins
            </span>
            <h1 className="mt-4 text-headline-xl">
              Fresh cravings, <span className="text-primary">delivered hot</span> to your door.
            </h1>
            <p className="mt-4 max-w-md text-body-lg text-on-surface-variant">
              Discover top-rated local restaurants, gourmet street food, and farm-fresh organic
              bowls crafted by award-winning chefs.
            </p>
            <div className="mt-6 flex flex-col gap-3 rounded-full bg-white p-2 shadow-card sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Icon name="search" className="text-on-surface-variant" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleExplore()}
                  placeholder="Search for sushi, burgers, poke bowls..."
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-on-surface-variant"
                />
              </div>
              <button onClick={handleExplore} className="btn-primary w-full sm:w-auto">
                Explore Food <Icon name="arrow_forward" className="!text-base" />
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-card-md">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80"
                alt="Signature burger"
                className="h-72 w-full rounded-2xl object-cover"
              />
              <div className="flex items-center gap-3 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-secondary">
                  4.9
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold">The Burger Joint</p>
                  <p className="text-xs text-on-surface-variant">20-25 mins • Free Delivery</p>
                </div>
                <Icon name="favorite" className="text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Categories</p>
            <h2 className="mt-1 text-headline-md">What are you craving today?</h2>
          </div>
          <button onClick={() => navigate("/foods")} className="hidden text-sm font-bold text-primary sm:block">
            See All ›
          </button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {categories.map((c) => (
            <CategoryIcon
              key={c.id}
              icon={c.icon}
              color={c.color}
              label={c.name}
              onClick={() => navigate(`/foods?category=${encodeURIComponent(c.name)}`)}
            />
          ))}
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Handpicked Favorites</p>
        <h2 className="mt-1 text-headline-md">Featured Dishes</h2>
        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-surface-container-high" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        )}
      </section>

      {/* 3 easy steps */}
      <section className="mx-auto max-w-7xl px-4 pb-14 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Simple & Fast</p>
        <h2 className="mt-1 text-headline-lg">Order Delicious Food in 3 Easy Steps</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-on-surface-variant">
          Effortless ordering paired with swift doorstep delivery so you can satisfy your cravings
          without missing a beat.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.step} className="card p-8">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/15 text-primary">
                <Icon name={s.icon} className="!text-3xl" />
              </span>
              <span className="mt-4 inline-block rounded-full bg-surface-container-high px-3 py-1 text-[11px] font-bold text-on-surface-variant">
                {s.step}
              </span>
              <h3 className="mt-2 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App promo */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl bg-gradient-to-br from-primary-container/10 to-secondary-container/10 p-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/20 px-3 py-1.5 text-xs font-bold text-primary">
              📱 FreshBites Mobile App
            </span>
            <h2 className="mt-4 text-headline-lg">
              Take FreshBites Wherever <span className="text-primary">You Crave</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-on-surface-variant">
              Get exclusive mobile perks, live order tracking on interactive maps, and priority
              delivery directly from your phone.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Zero Delivery Fee on First 3 Orders",
                "Real-time GPS Tracking with live ETA updates",
                "Exclusive Weekly Chef Specials and secret drop alerts",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container text-secondary">
                    <Icon name="check" className="!text-sm" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-[#1c1b1f] px-4 py-3 text-white">
                <Icon name="apple" />
                <span className="text-left text-xs leading-tight">
                  DOWNLOAD ON<br /><span className="text-sm font-bold">Apple App Store</span>
                </span>
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-[#1c1b1f] px-4 py-3 text-white">
                <Icon name="android" />
                <span className="text-left text-xs leading-tight">
                  GET IT ON<br /><span className="text-sm font-bold">Google Play</span>
                </span>
              </button>
            </div>
            <p className="mt-3 text-xs text-on-surface-variant">★★★★★ 4.9/5 (20k+ food lovers)</p>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-5 shadow-card-md">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="h-2 w-2 rounded-full bg-secondary" /> Live Courier Status
              </span>
              <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs">Order #8492</span>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary-container/10 p-3">
              <span className="text-2xl">🏍️</span>
              <div>
                <p className="text-sm font-bold">On the way • 12 mins away</p>
                <p className="text-xs text-on-surface-variant">Courier Marco is approaching your street</p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container-high/40 p-3 text-sm">
              <span className="flex items-center gap-2 font-semibold">🍔 Truffle Burger & Shake</span>
              <span className="font-bold text-primary">$18.49</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
