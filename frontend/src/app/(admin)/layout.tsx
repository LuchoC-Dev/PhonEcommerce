import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import '../globals.css'
import { AuthProvider } from '@features/auth/context/AuthContext'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Admin — ImNotPhound',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a0f] text-[#f8fafc]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
