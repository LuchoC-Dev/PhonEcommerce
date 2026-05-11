"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@features/auth/store/auth.store";

const links = [
  { href: "/profile", label: "Mi perfil", icon: "👤", matchMode: "exact" as const },
  { href: "/orders", label: "Mis pedidos", icon: "📦", matchMode: "prefix" as const },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  function isActive(href: string, mode: "exact" | "prefix") {
    if (mode === "exact") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-52 shrink-0 p-4 bg-surface/50 rounded-l-xl">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Cuenta</p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = isActive(link.href, link.matchMode);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-primary-muted/40 text-white border-l-2 border-primary pl-3"
                  : "text-text-muted hover:bg-border hover:text-text"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-border hover:text-text transition-all duration-150"
          >
            <span>🛠️</span>
            <span>Panel admin</span>
          </Link>
        )}
      </nav>
    </aside>
  );
}
