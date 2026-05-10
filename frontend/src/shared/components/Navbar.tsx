'use client'

import Link from "next/link";
import { useAuthStore } from "@features/auth/store/auth.store";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useCartStore, selectItemCount } from "@features/cart/store/cart.store";

function Navbar() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const { logout } = useAuth()
  const openCart = useCartStore((s) => s.open)
  const itemCount = useCartStore(selectItemCount)

  return (
    <header className="sticky top-0 z-40 border-b border-[#1e2028] bg-[#0a0a0f]/90 backdrop-blur-md shadow-[0_1px_0_rgba(99,102,241,0.15)]">
      <nav
        className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-[--font-display] text-2xl font-bold text-[--color-text] hover:text-[--color-primary-light] transition-colors"
        >
          <svg className="w-7 h-7 text-[--color-primary] group-hover:scale-110 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h3" />
          </svg>
          <span className="group-hover:scale-105 inline-block transition-transform duration-150">ImNotPhound</span>
        </Link>

        {/* Links de navegación */}
<div className="hidden md:flex items-center gap-1">
          <Link
            href="/catalog"
            className="group flex items-center justify-center h-10 px-5 rounded-full text-[--color-text-muted] hover:text-white hover:ring-2 hover:ring-[#6366f1]/20 text-[15px] font-medium transition-all duration-150"
          >
            <span className="inline-block group-hover:scale-105 transition-transform duration-150">Catálogo</span>
          </Link>
          {isAuthenticated && (
            <Link
              href="/orders"
              className="group flex items-center justify-center h-10 px-5 rounded-full text-[--color-text-muted] hover:text-white hover:ring-2 hover:ring-[#6366f1]/20 text-[15px] font-medium transition-all duration-150"
            >
              <span className="inline-block group-hover:scale-105 transition-transform duration-150">Mis pedidos</span>
            </Link>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Carrito */}
          <button
            onClick={openCart}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full hover:ring-2 hover:ring-[#6366f1]/20 text-[--color-text-muted] hover:text-[--color-text] transition-all duration-150 cursor-pointer"
            aria-label={`Carrito de compras${itemCount > 0 ? ` (${itemCount} ítems)` : ''}`}
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#6366f1] text-white text-[10px] font-bold leading-none">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-20 h-4 rounded bg-[#1e1e2e] animate-pulse" />
              <div className="w-16 h-9 rounded-[--radius-md] bg-[#1e1e2e] animate-pulse" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#1e1e2e] bg-[#0f0f17] text-[#818cf8] font-bold text-base hover:border-[#6366f1] hover:ring-2 hover:ring-[#6366f1]/20 transition-all duration-150"
                aria-label={`Perfil de ${user.username}`}
              >
                <span className="inline-block group-hover:scale-110 transition-transform duration-150">{user.username[0].toUpperCase()}</span>
              </Link>
              <span className="w-px h-6 bg-[#1e1e2e]" />
              <button
                onClick={logout}
                className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#1e1e2e] hover:border-red-500/50 hover:ring-2 hover:ring-red-500/20 bg-[#0f0f17] hover:bg-red-500/10 text-[--color-text-muted] hover:text-red-400 transition-all duration-150 cursor-pointer"
                aria-label="Cerrar sesión"
              >
                <svg className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="group hidden sm:inline-flex items-center h-9 px-4 text-sm font-medium rounded-[--radius-md] text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-surface] transition-all duration-150"
              >
                <span className="inline-block group-hover:scale-105 transition-transform duration-150">Iniciar sesión</span>
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center h-9 px-4 text-sm font-medium rounded-[--radius-md] bg-[--color-primary] text-white hover:bg-[--color-primary-hover] transition-all duration-150"
              >
                <span className="inline-block group-hover:scale-105 transition-transform duration-150">Registrarse</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export { Navbar };
