export default function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbol ${className}`}>{name}</span>;
}
