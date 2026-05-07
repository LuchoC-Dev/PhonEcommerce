import Link from "next/link";

function Navbar() {
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
          <Link
            href="/deals"
            className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors"
          >
            Ofertas
          </Link>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Carrito */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-[--radius-md] text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-surface] transition-colors"
            aria-label="Carrito de compras"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </Link>

          {/* Auth */}
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-medium rounded-[--radius-md] text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-surface] transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center h-9 px-4 text-sm font-medium rounded-[--radius-md] bg-[--color-primary] text-white hover:bg-[--color-primary-hover] transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </nav>
    </header>
  );
}

export { Navbar };
