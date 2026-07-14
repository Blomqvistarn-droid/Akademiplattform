import Link from "next/link";

export interface EducationBreadcrumbItem {
  label: string;
  href?: string;
}

export function EducationBreadcrumbs({
  items,
}: {
  items: readonly EducationBreadcrumbItem[];
}) {
  return (
    <nav aria-label="Utbildningsnavigering" className="breadcrumbs">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
            )}
            {!isLast ? <span className="separator">/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
