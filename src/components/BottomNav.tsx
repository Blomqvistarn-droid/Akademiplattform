"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["Hem", "/"],
  ["Utbildning", "/utbildning"],
  ["Pass", "/pass"],
  ["Övningar", "/ovningar"],
  ["Reflektion", "/reflektion"]
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomNav" aria-label="Huvudnavigation">
      {items.map(([label, href]) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={isActive ? "active" : undefined}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
