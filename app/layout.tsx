import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import FilmGrain from '@/components/FilmGrain'
import { PageTransitionProvider } from '@/components/PageTransition'
import { CartProvider } from '@/components/CartDrawer'
import ScrollAnimations from '@/components/ScrollAnimations'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Blush & Hush — Interior Architecture & Bespoke Design, Chennai',
  description:
    'Luxury interior architecture studio crafting bespoke spaces and handcrafted furniture across India. Projects in Chennai, Bengaluru, Dubai.',
  keywords:
    'interior design Chennai, luxury interior architecture India, bespoke furniture Chennai',
  metadataBase: new URL('https://blushandhush.in'),
  openGraph: {
    title: 'Blush & Hush Interior Architecture',
    description: 'Where space meets intention.',
    images: ['/og-image.jpg'],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <CartProvider>
          <SmoothScroll>
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
          </SmoothScroll>
          <ScrollAnimations />
        </CartProvider>
        <Cursor />
        <FilmGrain />
        <Analytics />
      </body>
    </html>
  )
}
