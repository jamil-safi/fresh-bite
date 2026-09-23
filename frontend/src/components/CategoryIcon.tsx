import Icon from "./Icon";

const BG: Record<string, string> = {
  "primary-container": "bg-primary-container/15 text-primary",
  tertiary: "bg-tertiary/15 text-tertiary",
  secondary: "bg-secondary-container/60 text-secondary",
  "surface-container-high": "bg-surface-container-high text-primary",
};

export default function CategoryIcon({
  icon,
  color,
  label,
  active,
  onClick,
}: {
  icon: string;
  color: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-sm font-semibold transition ${
        active ? "bg-primary text-white shadow-card-md" : "card hover:shadow-card-md"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          active ? "bg-white/20 text-white" : BG[color] ?? "bg-surface-container-high text-primary"
        }`}
      >
        <Icon name={icon} />
      </span>
      {label}
    </button>
  );
}
