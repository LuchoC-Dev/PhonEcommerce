const STATS = [
  { label: 'productos', value: '500+', icon: '📱' },
  { label: 'marcas', value: '50+', icon: '🏷️' },
  { label: 'envío a todo el país', value: '', icon: '🚚' },
  { label: 'soporte', value: '24/7', icon: '💬' },
] as const

export function StatsBar() {
  return (
    <section className="border-t border-b border-[#1e1e2e] bg-[#0f0f17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-[#1e1e2e]">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center lg:py-2">
              <span className="text-2xl mb-2">{stat.icon}</span>
              <span className="font-[--font-display] text-2xl font-bold text-text">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}