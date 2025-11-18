import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ship or Die - Prediction Markets for Startup Milestones",
  description: "Ship or Die turns startup milestones into on-chain prediction markets.",
  openGraph: {
    title: "Ship or Die - Prediction Markets for Startup Milestones",
    description: "Ship or Die turns startup milestones into on-chain prediction markets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ship or Die - Prediction Markets for Startup Milestones",
    description: "Ship or Die turns startup milestones into on-chain prediction markets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
