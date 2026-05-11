import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { MusicPlayer } from '@/components/music-player'
import { LoadingScreen } from "@/components/loading-screen"
import { ScrollProgress } from "@/components/scroll-progress"
import { CustomCursor } from "@/components/custom-cursor"
import { VisitCounter } from "@/components/visit-counter"

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  // Google Search Console verification
  verification: {
    google: 'O3mzK2B28rXTv3XH1bqDHQntQ2bhQsdFJ_hR7xYjciE',
  },

  // Tab title — shows in Google search results
  title: {
    default: 'SUBIT | Creator & Meme Lord',
    template: '%s | SUBIT',
  },

  // Meta description — shown under title in Google
  description: 'SUBIT is a 17-year-old meme creator and aspiring artist from Barishal, Bangladesh. Aesthetic, chill content on Instagram and TikTok. Memes, Art & Good Vibes Only.',

  // Keywords (less important for Google now but still useful)
  keywords: [
    'SUBIT', 'subit', 'hexed.subit', 'meme creator', 'meme lord',
    'aesthetic memes', 'anime memes', 'Bangladesh creator',
    'content creator', 'artist', 'portfolio', 'TikTok', 'Instagram',
  ],

  // Author
  authors: [{ name: 'SUBIT', url: 'https://subit.site' }],
  creator: 'SUBIT',

  // Canonical URL — tells Google your main URL
  metadataBase: new URL('https://subit.site'),
  alternates: {
    canonical: '/',
  },

  // Robots — tell Google to index your site
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  // Open Graph — how your site looks when shared on Facebook, Discord, WhatsApp
  openGraph: {
    title: 'SUBIT | Creator & Meme Lord',
    description: 'Memes, Art & Good Vibes Only. 17-year-old creator from Bangladesh.',
    url: 'https://subit.site',
    siteName: 'SUBIT',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/profile.jpg',
        width: 800,
        height: 800,
        alt: 'SUBIT - Creator & Meme Lord',
      },
    ],
  },

  // Twitter/X card — how your site looks when shared on Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'SUBIT | Creator & Meme Lord',
    description: 'Memes, Art & Good Vibes Only. 17-year-old creator from Bangladesh.',
    creator: '@subi',
    images: ['/profile.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <ScrollProgress />
        <CustomCursor />
        <LoadingScreen />
        {children}
        <MusicPlayer />
        <VisitCounter />
        <Analytics/>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}