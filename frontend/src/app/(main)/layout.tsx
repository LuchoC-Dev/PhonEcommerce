import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "../globals.css";
import { Navbar } from "@shared/components/Navbar";
import { Footer } from "@shared/components/Footer";
import { AuthProvider } from "@features/auth/context/AuthContext";
import { CartSlideOver } from "@features/cart/components/CartSlideOver";
import { CartSync } from "@features/cart/components/CartSync";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ImNotPhound — Teléfonos Premium",
  description: "Tu destino para encontrar el teléfono perfecto. Catálogo curado de smartphones premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--color-bg] text-[--color-text]">
        <AuthProvider>
          <CartSync />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSlideOver />
        </AuthProvider>
      </body>
    </html>
  );
}
