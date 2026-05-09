import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { MusicPlayer } from '@/components/music-player'
import { LoadingScreen } from "@/components/loading-screen"

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: 'SUBIT | Creator & Meme Lord',
  description: 'Welcome to SUBIT\'s premium creator portfolio. Explore my content, connect on socials, and let\'s create something amazing together.',
  keywords: ['creator', 'designer', 'digital builder', 'content creator', 'portfolio', 'SUBIT'],
  authors: [{ name: 'SUBIT' }],
  openGraph: {
    title: 'SUBIT | Creator • Designer • Digital Builder',
    description: 'Welcome to SUBIT\'s premium creator portfolio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUBIT | Creator • Designer • Digital Builder',
    description: 'Welcome to SUBIT\'s premium creator portfolio.',
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
        <LoadingScreen />
        {children}
        <MusicPlayer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}