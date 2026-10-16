import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { MusicPlayer } from '@/components/music-player'
import { LoadingScreen } from "@/components/loading-screen"
import { ScrollProgress } from "@/components/scroll-progress"
import { CustomCursor } from "@/components/custom-cursor"
import { Snow } from "@/components/snow"
import { EasterEgg } from "@/components/easter-egg"
import { ACCENT_INIT_SCRIPT } from "@/lib/accent"

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
    'SUBIT', 'subit', 'subynxz', 'meme creator', 'meme lord',
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

   icons: {
    icon: [
      { url: '/favicon.ico?v=3' },
      { url: '/favicon-16x16.png?v=3', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=3', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png?v=3',
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
    creator: '@Fuegoweb3',
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
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ACCENT_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <ScrollProgress />
        <CustomCursor />
        <LoadingScreen />
        <Snow />
        <EasterEgg />
        {children}
        <MusicPlayer />
        <Analytics/>
      </body>
    </html>
  )
}