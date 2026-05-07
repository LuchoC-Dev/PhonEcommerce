import Link from "next/link";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[--color-border] bg-[--color-surface] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-[--font-display] text-lg font-bold text-[--color-text] hover:text-[--color-primary-light] transition-colors"
            >
              📱 ImNotPhound
            </Link>
            <p className="mt-3 text-sm text-[--color-text-muted] max-w-xs">
              Tu destino para encontrar el teléfono perfecto. Catálogo curado de smartphones premium.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-[--font-display] text-sm font-semibold text-[--color-text] mb-4">
              Tienda
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Catálogo", href: "/catalog" },
                { label: "Ofertas", href: "/deals" },
                { label: "Novedades", href: "/new" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[--font-display] text-sm font-semibold text-[--color-text] mb-4">
              Soporte
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Mi cuenta", href: "/profile" },
                { label: "Mis pedidos", href: "/orders" },
                { label: "Contacto", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[--color-border] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[--color-text-subtle]">
            © {year} ImNotPhound. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-[--color-text-subtle] hover:text-[--color-text-muted] transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-xs text-[--color-text-subtle] hover:text-[--color-text-muted] transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
