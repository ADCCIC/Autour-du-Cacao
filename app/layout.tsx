import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
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
      <body className="min-h-full flex flex-col bg-cacao-50 text-gray-900">
        <header className="bg-cacao-900 text-cacao-50 px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Autour du Cacao"
              width={120}
              height={60}
              className="h-10 w-auto object-contain bg-white rounded"
              priority
            />
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/episodes" className="hover:text-sage-300 transition-colors">
              Épisodes
            </Link>
            <Link href="/videos" className="hover:text-sage-300 transition-colors">
              Vidéos
            </Link>
            <Link href="/articles" className="hover:text-sage-300 transition-colors">
              Articles
            </Link>
            <Link href="/blog" className="hover:text-sage-300 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-sage-300 transition-colors">
              À propos
            </Link>
            <Link href="/newsletter" className="hover:text-sage-300 transition-colors">
              Newsletter
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-cacao-900 text-cacao-200 py-8 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-between">
            <div>
              <Image
                src="/logo.jpg"
                alt="Autour du Cacao"
                width={100}
                height={50}
                className="h-8 w-auto object-contain bg-white rounded mb-2"
              />
              <p className="text-xs text-cacao-400">Le podcast qui va au-delà du chocolat</p>
            </div>
            <div className="w-full md:w-72">
              <p className="text-sm font-medium text-cacao-100 mb-2">Newsletter</p>
              <p className="text-xs text-cacao-400 mb-3">Chaque épisode dans votre boîte mail.</p>
              <NewsletterForm variant="compact" />
            </div>
          </div>
          <p className="text-center text-xs text-cacao-600 mt-8">
            © {new Date().getFullYear()} Autour du Cacao · autourducacao.com
          </p>
        </footer>
      </body>
    </html>
  );
}
