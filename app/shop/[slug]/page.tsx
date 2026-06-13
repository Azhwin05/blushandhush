'use client'
import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useCart } from '@/components/CartDrawer'
import { products } from '@/lib/data'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug)
  if (!product) notFound()

  const [activeMaterial, setActiveMaterial] = useState(product.materials[0])
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      material: activeMaterial,
      price: product.price,
    })
  }

  const toggleAccordion = (key: string) =>
    setOpenAccordion((v) => (v === key ? null : key))

  const accordionItems = [
    { key: 'dims', label: 'Dimensions & Specifications', content: product.dimensions },
    { key: 'care', label: 'Care & Materials', content: product.careInstructions },
    { key: 'delivery', label: 'Delivery & Lead Time', content: `Lead time: ${product.leadTime}. We will contact you to confirm details.` },
    { key: 'bespoke', label: 'Bespoke Options', content: 'Bespoke sizing and custom finishes are available on request. Enquire below.' },
  ]

  const swatchColors: Record<string, string> = {
    Brass: '#B5935A',
    'Matte Black': '#1a1a18',
    Chrome: '#C0C0C0',
    Travertine: '#D4C4A8',
    'Cream Boucle': '#E8DCC8',
    'Green Onyx': '#4E7B5A',
    'Blackened Steel': '#2a2a28',
    'Matte White': '#F0EEE8',
    Terracotta: '#C46A45',
    'Ash Glaze': '#8A8A82',
    'Natural Linen': '#D8C8A8',
    'Ecru Cotton': '#F0E8D8',
    'Matte White ': '#F0EEE8',
  }

  return (
    <>
      <Nav />

      <main className="pt-[72px]" style={{ backgroundColor: 'var(--ivory)' }}>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] min-h-screen">
          {/* ── Left — Images ─────────────────────────────── */}
          <div className="px-6 md:px-10 py-10 flex flex-col gap-3">
            {/* Main image */}
            <div
              className="relative w-full cursor-zoom-in"
              style={{ aspectRatio: '4/5', backgroundColor: 'var(--charcoal)' }}
              onClick={() => setLightboxOpen(true)}
              data-cursor="view"
            >
              <div className="absolute inset-0 img-placeholder">
                <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
                  Photography placeholder: {product.name} — {activeMaterial}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className="flex-shrink-0"
                  style={{
                    width: '72px', height: '90px',
                    backgroundColor: 'var(--charcoal)',
                    border: activeImage === i ? '0.5px solid var(--navy)' : '0.5px solid var(--linen)',
                    cursor: 'pointer',
                    opacity: activeImage === i ? 1 : 0.5,
                    transition: 'opacity 0.2s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Right — Details (sticky) ───────────────────── */}
          <div
            className="px-8 md:px-12 py-10 md:py-16 md:sticky md:top-[72px] self-start"
            style={{ maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}
          >
            <p className="label mb-3" style={{ color: 'var(--gold)' }}>
              Limited Edition · Handcrafted
            </p>
            <h1
              className="font-cormorant italic"
              style={{ fontSize: 'clamp(32px, 3vw, 48px)', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.1 }}
            >
              {product.name}<br />{product.subtitle}
            </h1>
            <p className="label mt-3" style={{ color: 'var(--steel)' }}>
              {activeMaterial} Edition ·{' '}
              {product.limited > 0
                ? `In stock: ${product.stock} of ${product.limited}`
                : `In stock: ${product.stock}`}
            </p>

            <div style={{ borderTop: '0.5px solid var(--linen)', margin: '20px 0' }} />

            <p className="body-lg mb-6" style={{ color: 'var(--charcoal)' }}>
              {product.description}
            </p>

            {/* Material selector */}
            <div className="mb-6">
              <p className="label mb-3" style={{ color: 'var(--steel)' }}>
                Finish: {activeMaterial}
              </p>
              <div className="flex gap-3">
                {product.materials.map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMaterial(m)}
                    title={m}
                    style={{
                      width: '20px', height: '20px',
                      borderRadius: '50%',
                      backgroundColor: swatchColors[m] || 'var(--linen)',
                      border: activeMaterial === m
                        ? '0.5px solid var(--navy)'
                        : '0.5px solid var(--linen)',
                      cursor: 'pointer',
                      outline: activeMaterial === m ? '1px solid var(--navy)' : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <p className="mb-6" style={{ color: 'var(--gold)', fontSize: '24px', fontFamily: 'var(--font-dm-sans)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            {/* CTAs */}
            <button onClick={handleAddToCart} className="btn-primary btn-navy w-full mb-3">
              <span>Add to cart →</span>
            </button>
            <Link href="/contact" className="btn-primary btn-ivory w-full block text-center" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }} data-cursor="enquire">
              <span>Enquire about this piece</span>
            </Link>

            {/* Accordion */}
            <div className="mt-8 flex flex-col" style={{ borderTop: '0.5px solid var(--linen)' }}>
              {accordionItems.map(({ key, label, content }) => (
                <div key={key} style={{ borderBottom: '0.5px solid var(--linen)' }}>
                  <button
                    onClick={() => toggleAccordion(key)}
                    className="w-full flex items-center justify-between py-4"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span className="label" style={{ color: 'var(--navy)' }}>{label}</span>
                    <span className="label" style={{ color: 'var(--steel)' }}>
                      {openAccordion === key ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className="accordion-content"
                    style={{ maxHeight: openAccordion === key ? '200px' : '0' }}
                  >
                    <p className="body-sm pb-4" style={{ color: 'var(--charcoal)' }}>{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9996] flex items-center justify-center"
          style={{ backgroundColor: 'var(--navy)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-8 right-8 label"
            style={{ color: 'var(--ivory)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            × Close
          </button>
          <div
            className="img-placeholder"
            style={{
              width: '90vw', height: '90vh',
              maxWidth: '900px',
              backgroundColor: '#2a2828',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{ color: 'var(--steel)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Photography placeholder: {product.name} — fullscreen
            </span>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
