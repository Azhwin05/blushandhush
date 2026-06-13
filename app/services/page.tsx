import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const services = [
  {
    num: '01',
    title: 'Interior Architecture',
    desc: 'Full architectural scope — spatial planning, material palette, lighting design, built elements, and furniture specification. We treat the shell of a space as architecture, not decoration.',
  },
  {
    num: '02',
    title: 'Bespoke Furniture Design',
    desc: 'Furniture designed specifically for your space and lifestyle. We work with craftspeople across India to realise pieces that cannot be bought.',
  },
  {
    num: '03',
    title: 'Material Sourcing & Curation',
    desc: 'We source stone, wood, fabric, and hardware from suppliers across India, Europe, and the Middle East. Materials are handled as objects in their own right.',
  },
  {
    num: '04',
    title: 'Project Management',
    desc: 'End-to-end coordination of contractors, craftspeople, and suppliers. We are on site throughout construction, not just at the beginning and end.',
  },
  {
    num: '05',
    title: 'Styling & Installation',
    desc: 'The final layer — objects, art, textiles, plants. We complete every space we design, down to the last detail.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <Nav />

      <header
        className="flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: 'var(--navy)', minHeight: '50vh', padding: '120px 24px 80px' }}
        data-dark
      >
        <h1
          className="font-cormorant italic text-ivory"
          style={{ fontSize: 'clamp(52px, 7vw, 72px)', fontWeight: 300, lineHeight: 1.05 }}
        >
          What We Do
        </h1>
      </header>

      <section className="px-6 md:px-10 py-20" style={{ backgroundColor: 'var(--ivory)' }}>
        <div className="flex flex-col" style={{ borderTop: '0.5px solid var(--linen)' }}>
          {services.map((s, i) => (
            <div
              key={s.num}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr_2fr] gap-6 md:gap-12 py-10"
              style={{ borderBottom: '0.5px solid var(--linen)' }}
            >
              <span className="label" style={{ color: 'var(--gold)' }}>{s.num}</span>
              <h2
                className="font-cormorant italic"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.2 }}
              >
                {s.title}
              </h2>
              <p className="body-lg" style={{ color: 'var(--charcoal)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="flex flex-col items-center text-center py-24 px-6"
        style={{ backgroundColor: 'var(--linen)' }}
      >
        <span className="gold-rule block mx-auto mb-8" />
        <h2
          className="font-cormorant italic mb-6"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--navy)' }}
        >
          Ready to begin?
        </h2>
        <Link href="/contact" className="btn-primary btn-navy" data-cursor="enquire">
          <span>Start a conversation →</span>
        </Link>
      </section>

      <Footer />
    </>
  )
}
