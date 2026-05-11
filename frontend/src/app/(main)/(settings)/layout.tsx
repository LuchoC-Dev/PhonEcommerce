import { SettingsSidebar } from '@features/settings'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-[#0f0f17] border border-[#1e1e2e] rounded-xl flex">
        <SettingsSidebar />
        <div className="w-px bg-[#1e1e2e]" />
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  )
}