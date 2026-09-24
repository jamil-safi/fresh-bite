import { FoodItem } from "../types";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import Icon from "./Icon";

const TAG_STYLES: Record<string, string> = {
  Popular: "bg-primary text-white",
  "Chef Special": "bg-tertiary text-white",
  Trending: "bg-secondary text-white",
  Healthy: "bg-secondary-container text-secondary",
};

export default function FoodCard({ food }: { food: FoodItem }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [liked, setLiked] = useState(false);

  async function handleAdd() {
    setAdding(true);
    try {
      await addItem(food, 1);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="card overflow-hidden transition hover:shadow-card-md">
      <div className="relative h-44 w-full overflow-hidden bg-surface-container-high">
        <img src={food.imageUrl} alt={food.name} className="h-full w-full object-cover" loading="lazy" />
        {food.tag && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              TAG_STYLES[food.tag] ?? "bg-primary text-white"
            }`}
          >
            {food.tag}
          </span>
        )}
        <button
          onClick={() => setLiked((l) => !l)}
          aria-label="Save to favorites"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
        >
          <Icon name="favorite" className={liked ? "text-primary" : "text-on-surface-variant"} />
        </button>
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold shadow">
          <Icon name="star" className="!text-sm text-tertiary" />
          {Number(food.rating).toFixed(1)}
          <span className="font-normal text-on-surface-variant">({food.reviewCount})</span>
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-snug">{food.name}</h3>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">{food.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-extrabold text-primary">${Number(food.price).toFixed(2)}</span>
          <button onClick={handleAdd} disabled={adding} className="btn-primary !px-4 !py-2 text-xs">
            <Icon name="shopping_cart" className="!text-base" />
            {adding ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
