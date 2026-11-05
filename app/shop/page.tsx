'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function ShopPage() {
  return (
    <>
      <Nav />

      {/* Header */}
      <header
        className="flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: 'var(--navy)', minHeight: '50vh', padding: '120px 24px 80px' }}
        data-dark
      >
        <h1
          className="font-cormorant italic text-ivory"
          style={{ fontSize: 'clamp(52px, 7vw, 72px)', fontWeight: 300, lineHeight: 1.05 }}
        >
          The Collection
        </h1>
      </header>

      {/* Sevvagam — our only product for now */}
      <main className="px-[2px] py-[2px]" style={{ backgroundColor: 'var(--navy)' }}>
        <Link
          href="/sevvagam"
          className="group relative block mx-auto"
          style={{ backgroundColor: 'var(--ivory)', maxWidth: '560px' }}
          data-cursor="view"
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dmhonzqrm/image/upload/f_auto,q_auto/v1782055398/sevvaagam_4_ukubsn.jpg"
              alt="Sevvagam"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400 group-hover:opacity-90"
            />
          </div>
          <div className="px-4 py-4 flex flex-col gap-2">
            <p className="label-sm" style={{ color: 'var(--steel)' }}>Signature Piece</p>
            <h3
              className="font-cormorant italic"
              style={{ fontSize: '24px', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.2 }}
            >
              Sevvagam
            </h3>
            <p className="label-sm" style={{ color: 'var(--gold)' }}>View &amp; commission →</p>
          </div>
        </Link>
      </main>

      <Footer />
    </>
  )
}
