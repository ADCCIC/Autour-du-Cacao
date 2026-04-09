import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import NewsletterForm from "@/components/NewsletterForm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autour du Cacao — Le podcast qui va au-delà du chocolat",
  description:
    "Deux fois par mois, Willy Gabriel et Axel Emmanuel explorent les multiples vies du cacao : cosmétiques, jus, engrais, innovations locales. Le cacao bien au-delà de la tablette.",
  metadataBase: new URL("https://autourducacao.com"),
  openGraph: {
    siteName: "Autour du Cacao",
    url: "https://autourducacao.com",
    type: "website",
    locale: "fr_FR",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://api.riverside.fm/hosting/7TYf1H62.rss",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-amber-50 text-gray-900">
        <header className="bg-amber-900 text-amber-50 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            🍫 Autour du Cacao
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/episodes" className="hover:text-amber-200 transition-colors">
              Épisodes
            </Link>
            <Link href="/videos" className="hover:text-amber-200 transition-colors">
              Vidéos
            </Link>
            <Link href="/articles" className="hover:text-amber-200 transition-colors">
              Articles
            </Link>
            <Link href="/blog" className="hover:text-amber-200 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-amber-200 transition-colors">
              À propos
            </Link>
            <Link href="/newsletter" className="hover:text-amber-200 transition-colors">
              Newsletter
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-amber-900 text-amber-200 py-8 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-between">
            <div>
              <p className="font-bold text-amber-100 mb-1">🍫 Autour du Cacao</p>
              <p className="text-xs text-amber-400">Le podcast qui va au-delà du chocolat</p>
            </div>
            <div className="w-full md:w-72">
              <p className="text-sm font-medium text-amber-100 mb-2">Newsletter</p>
              <p className="text-xs text-amber-400 mb-3">Chaque épisode dans votre boîte mail.</p>
              <NewsletterForm variant="compact" />
            </div>
          </div>
          <p className="text-center text-xs text-amber-600 mt-8">
            © {new Date().getFullYear()} Autour du Cacao · autourducacao.com
          </p>
        </footer>
      </body>
    </html>
  );
}
