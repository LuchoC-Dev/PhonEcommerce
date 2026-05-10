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
    <header className="sticky top-0 z-40 border-b border-[#1e2028] bg-[#0a0a0a]">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[--font-display] text-xl font-bold text-[--color-text] hover:text-[--color-primary-light] transition-colors"
        >
          <span className="text-[--color-primary]">📱</span>
          ImNotPhound
        </Link>

        {/* Links de navegación */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/catalog"
            className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors"
          >
            Catálogo
          </Link>
          {isAuthenticated && user && (
            <>
              <Link
                href="/orders"
                className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors"
              >
                Mis pedidos
              </Link>
              <Link
                href="/profile"
                className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors"
              >
                Mi perfil
              </Link>
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Carrito */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center w-9 h-9 rounded-[--radius-md] text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-surface] transition-colors"
            aria-label={`Carrito de compras${itemCount > 0 ? ` (${itemCount} ítems)` : ''}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-[--color-text-muted]">
                Hola,{" "}
                <span className="text-[--color-text] font-medium">
                  {user.username}
                </span>
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center h-9 px-4 text-sm font-medium rounded-[--radius-md] text-[--color-text-muted] hover:text-[--color-danger] hover:bg-[--color-surface] transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-medium rounded-[--radius-md] text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-surface] transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center h-9 px-4 text-sm font-medium rounded-[--radius-md] bg-[--color-primary] text-white hover:bg-[--color-primary-hover] transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export { Navbar };
