'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useCart } from '@/components/CartDrawer'
import { products } from '@/lib/data'

const FILTERS = ['All', 'Lighting', 'Seating', 'Tables', 'Objects', 'Textiles'] as const
type Filter = typeof FILTERS[number]
const SORTS = ['New', 'Price ↑', 'Price ↓'] as const
type Sort = typeof SORTS[number]

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [sort, setSort] = useState<Sort>('New')
  const { openCart } = useCart()

  let filtered = activeFilter === 'All'
    ? [...products]
    : products.filter((p) => p.category === activeFilter)

  if (sort === 'Price ↑') filtered.sort((a, b) => a.price - b.price)
  if (sort === 'Price ↓') filtered.sort((a, b) => b.price - a.price)
  if (sort === 'New') filtered = [
    ...filtered.filter((p) => p.isNew),
    ...filtered.filter((p) => !p.isNew),
  ]

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

      {/* Filter + Sort row */}
      <div
        className="flex items-center justify-between px-6 md:px-10 py-5 overflow-x-auto gap-6"
        style={{ backgroundColor: 'var(--ivory)', borderBottom: '0.5px solid var(--linen)' }}
      >
        <div className="flex items-center gap-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="label whitespace-nowrap pb-1"
              style={{
                color: activeFilter === f ? 'var(--navy)' : 'var(--steel)',
                borderBottom: activeFilter === f ? '0.5px solid var(--gold)' : '0.5px solid transparent',
                background: 'none', cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="label" style={{ color: 'var(--steel)' }}>Sort by:</span>
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="label whitespace-nowrap"
              style={{
                color: sort === s ? 'var(--navy)' : 'var(--steel)',
                background: 'none', cursor: 'pointer', border: 'none',
                textDecoration: sort === s ? 'underline' : 'none',
                textUnderlineOffset: '3px',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <main
        className="px-[2px] py-[2px]"
        style={{ backgroundColor: 'var(--navy)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

function ProductCard({ product }: { product: typeof products[0] }) {
  const [activeMaterial, setActiveMaterial] = useState(product.materials[0])
  const { addItem, openCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      material: activeMaterial,
      price: product.price,
    })
  }

  return (
    <div
      className="group flex flex-col cursor-pointer relative"
      style={{ backgroundColor: 'var(--ivory)' }}
      data-cursor="shop"
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
        <div className="absolute inset-0 img-placeholder transition-opacity duration-400 group-hover:opacity-80">
          <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
            Photography placeholder: {product.name}
          </span>
        </div>

        {/* Hover second image */}
        <div className="absolute inset-0 img-placeholder opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ backgroundColor: '#2a2828' }}>
          <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
            Photography placeholder: {product.name} — alt view
          </span>
        </div>

        {/* New badge */}
        {product.isNew && (
          <span
            className="absolute top-3 left-3 label-sm px-2 py-1"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--gold)' }}
          >
            New
          </span>
        )}
      </div>

      {/* Details */}
      <div className="px-4 py-4 flex flex-col gap-2">
        <p className="label-sm" style={{ color: 'var(--steel)' }}>{product.category}</p>
        <h3
          className="font-cormorant italic"
          style={{ fontSize: '20px', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.2 }}
        >
          {product.name}<br />
          <span style={{ fontSize: '16px' }}>{product.subtitle}</span>
        </h3>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-1">
          <p style={{ color: 'var(--gold)', fontSize: '16px', fontFamily: 'var(--font-dm-sans)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          <button
            onClick={handleAddToCart}
            className="btn-primary btn-navy"
            style={{ padding: '6px 14px', fontSize: '9px' }}
          >
            <span>Add →</span>
          </button>
        </div>

        {/* Material swatches */}
        <div className="flex items-center gap-2 mt-1">
          {product.materials.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMaterial(m)}
              title={m}
              style={{
                width: '14px', height: '14px',
                borderRadius: '50%',
                border: activeMaterial === m ? '0.5px solid var(--navy)' : '0.5px solid var(--linen)',
                backgroundColor: m === 'Brass' ? '#B5935A' : m === 'Matte Black' ? '#1a1a18' : m === 'Chrome' ? '#C0C0C0' : m === 'Travertine' ? '#D4C4A8' : m === 'Cream Boucle' ? '#E8DCC8' : 'var(--linen)',
                cursor: 'pointer',
                outline: 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Link overlay */}
      <Link href={`/shop/${product.slug}`} className="absolute inset-0" aria-label={product.name} />
    </div>
  )
}
