import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = { title: "7v7 Tränarapp", description: "Prototyp för klubbens spelarutbildning" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sv"><body><main className="appShell">{children}</main><BottomNav /></body></html>;
}
