import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchFoods } from "../api/food";
import { FoodItem } from "../types";
import FoodCard from "../components/FoodCard";
import Icon from "../components/Icon";

const CATEGORY_PILLS = ["All Foods", "Burgers", "Pizza", "Asian", "Salads", "Desserts"];
const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function AllFoods() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All Foods";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "recommended";

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [searchInput, setSearchInput] = useState(search);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFoods({ category, search, sort })
      .then(setFoods)
      .catch(() => setFoods([]))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <div>
      <section className="bg-surface-container-high/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Discovery Engine</p>
          <div className="mt-1 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-headline-lg">Explore All Cuisines & Cravings</h1>
              <p className="mt-2 max-w-lg text-sm text-on-surface-variant">
                From wood-fired pizzas to crisp garden salads, satisfy your deepest cravings
                instantly with FreshBites.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-card lg:w-96">
              <Icon name="search" className="text-on-surface-variant" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateParam("search", searchInput)}
                onBlur={() => updateParam("search", searchInput)}
                placeholder="Search burgers, salads, sushi..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-on-surface-variant"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_PILLS.map((c) => (
              <button
                key={c}
                onClick={() => updateParam("category", c === "All Foods" ? "" : c)}
                className={`pill ${
                  category === c ? "bg-primary text-white" : "bg-surface-container-high text-on-surface"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-on-surface-variant">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm font-semibold outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-surface-container-high" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="mt-16 text-center text-on-surface-variant">
            No dishes matched your search. Try a different keyword or category.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {foods.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
