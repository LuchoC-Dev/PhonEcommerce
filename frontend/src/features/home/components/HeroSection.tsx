import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 110%, rgba(99,102,241,0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-[--font-display] text-sm font-medium tracking-widest uppercase text-[--color-primary-light] mb-4">
          ImNotPhound
        </p>

        <h1 className="font-[--font-display] text-4xl sm:text-5xl lg:text-6xl font-bold text-[--color-text] leading-tight">
          Encontrá tu próximo{' '}
          <span className="text-[--color-primary]">teléfono</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-[--color-text-muted] leading-relaxed">
          Catálogo curado de smartphones premium. Compará marcas, modelos y precios
          para encontrar el que se adapta a tu vida.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-12 px-8 text-base font-medium font-[--font-display] rounded-[--radius-lg] bg-[--color-primary] text-white hover:bg-[--color-primary-hover] shadow-[--shadow-sm] hover:shadow-[--shadow-glow] transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[--color-primary] focus-visible:outline-offset-2"
          >
            Ver catálogo
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-12 px-8 text-base font-medium font-[--font-display] rounded-[--radius-lg] bg-transparent text-[--color-primary-light] border border-[--color-primary] hover:bg-[--color-primary-muted] hover:text-white transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[--color-primary] focus-visible:outline-offset-2"
          >
            Conocé las marcas
          </Link>
        </div>
      </div>
    </section>
  )
}