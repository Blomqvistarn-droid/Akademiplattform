export function Header({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return <header className="pageHeader">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1></header>;
}
