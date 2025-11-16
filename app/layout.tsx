import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ConnectWalletButton } from "@/components/ConnectWallet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProofMarket - Prediction Markets for Startup Milestones",
  description: "Bet on startup execution. Create transparent prediction markets for milestones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-gray-100`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        ProofMarket
                      </h1>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                      <Link 
                        href="/markets" 
                        className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
                      >
                        Markets
                      </Link>
                      <Link 
                        href="/markets/create" 
                        className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
                      >
                        Create Market
                      </Link>
                      <Link 
                        href="/admin/markets" 
                        className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
                      >
                        Admin
                      </Link>
                    </nav>
                  </div>
                  <ConnectWalletButton />
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-neutral-900 border-t border-neutral-800 py-8 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-400 text-sm">
                  © 2025 ProofMarket. Built on BNB Chain.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
