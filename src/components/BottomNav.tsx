import Link from "next/link";

const items = [
  ["Hem", "/"],
  ["Utbildning", "/utbildning"],
  ["Pass", "/pass"],
  ["Övningar", "/ovningar"],
  ["Reflektion", "/reflektion"]
];

export function BottomNav() {
  return (
    <nav className="bottomNav" aria-label="Huvudnavigation">
      {items.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
    </nav>
  );
}
