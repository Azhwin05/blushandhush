import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sevvagam — Crafted Around Art · Blush & Hush',
  description:
    'A handcrafted teak cabinet built to frame traditional Kalamkari art. Solid teak, hand-cast brass, woven cane, original Srikalahasti painting. Made in Chennai. Limited edition.',
  keywords:
    'Sevvagam, handcrafted teak cabinet, Kalamkari art, luxury Indian craft, Chennai artisan furniture, Blush Hush',
  openGraph: {
    title: 'Sevvagam · Crafted Around Art',
    description: 'A teak cabinet built to reveal, not contain.',
    images: ['/images/sevvagam/og.jpg'],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function SevvagamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
