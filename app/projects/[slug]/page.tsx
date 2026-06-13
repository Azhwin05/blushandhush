'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { projects } from '@/lib/data'

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()

  const idx = projects.indexOf(project)
  const next = projects[(idx + 1) % projects.length]

  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Horizontal scroll gallery via GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    let gsap: any, ScrollTrigger: any, ctx: any

    import('gsap').then((g) => {
      import('gsap/ScrollTrigger').then((st) => {
        gsap = g.gsap
        ScrollTrigger = st.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)

        const track = trackRef.current
        const gallery = galleryRef.current
        if (!track || !gallery) return

        ctx = gsap.context(() => {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: gallery,
              pin: true,
              scrub: 1,
              end: () => '+=' + track.scrollWidth,
              invalidateOnRefresh: true,
            },
          })
        })
      })
    })

    return () => ctx?.revert()
  }, [])

  const galleryImages = [
    ...(project.images || []),
    ...Array(Math.max(0, 4 - (project.images?.length || 0))).fill(null),
  ]

  return (
    <>
      <Nav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-screen" style={{ backgroundColor: 'var(--navy)' }} data-dark>
        <div className="absolute inset-0 img-placeholder" style={{ backgroundColor: '#1a2a3a' }}>
          <span
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2"
            style={{ color: 'var(--steel)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center' }}
          >
            Photography placeholder: {project.title} hero
          </span>
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(14,27,46,0.2) 0%, rgba(14,27,46,0.5) 100%)' }}
        />

        {/* Back link */}
        <Link
          href="/projects"
          className="absolute top-[88px] left-8 label z-10"
          style={{ color: 'var(--ivory)' }}
        >
          ← Back to Work
        </Link>

        {/* Project number */}
        <span
          className="absolute top-[88px] right-8 label z-10"
          style={{ color: 'var(--ivory)' }}
        >
          {String(projects.indexOf(project) + 1).padStart(2, '0')}
        </span>
      </section>

      {/* ── Info bar ─────────────────────────────────────── */}
      <div
        className="sticky top-[72px] z-50 flex items-center justify-between px-8 md:px-14 py-4"
        style={{ backgroundColor: 'var(--ivory)', borderBottom: '0.5px solid var(--linen)' }}
      >
        <h1
          className="font-cormorant italic"
          style={{ fontSize: '24px', fontWeight: 300, color: 'var(--navy)' }}
        >
          {project.title}
        </h1>
        <span className="label hidden md:block" style={{ color: 'var(--steel)' }}>
          {project.type} · {project.location} · {project.year}
        </span>
        <button className="label" style={{ color: 'var(--navy)', cursor: 'pointer', background: 'none', border: 'none' }}>
          ↗ Share
        </button>
      </div>

      {/* ── Horizontal Photo Gallery ──────────────────────── */}
      <section ref={galleryRef} data-cursor="drag" className="gallery-section">
        <div
          ref={trackRef}
          className="photo-track flex"
          style={{ width: 'max-content' }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 img-placeholder"
              style={{
                width: '70vw',
                height: '80vh',
                marginRight: '3px',
                backgroundColor: `hsl(${210 + i * 8}, 30%, ${15 + i * 3}%)`,
              }}
            >
              <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Photography placeholder: {project.title} — {i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile gallery — vertical */}
      <section className="md:hidden flex flex-col gap-[3px] px-4 py-10" style={{ backgroundColor: 'var(--ivory)' }}>
        {galleryImages.slice(0, 3).map((img, i) => (
          <div
            key={i}
            className="img-placeholder aspect-video w-full"
            style={{ backgroundColor: `hsl(${210 + i * 8}, 30%, ${15 + i * 3}%)` }}
          >
            <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Photography placeholder: {project.title} — {i + 1}
            </span>
          </div>
        ))}
      </section>

      {/* ── Project Description ───────────────────────────── */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8 md:px-14 py-16 md:py-24"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        {/* Left — narrative */}
        <div>
          <span className="gold-rule mb-6 block" />
          <p
            className="font-cormorant italic"
            style={{ fontSize: '20px', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.7 }}
          >
            {project.description}
          </p>
        </div>

        {/* Right — details table */}
        <div className="flex flex-col gap-6">
          {[
            { label: 'Client', value: project.client },
            { label: 'Location', value: project.location },
            { label: 'Area', value: project.area },
            { label: 'Year', value: project.year },
            { label: 'Materials', value: project.materials?.join(', ') },
          ].map((row) => (
            <div key={row.label} style={{ borderBottom: '0.5px solid var(--linen)', paddingBottom: '12px' }}>
              <p className="label mb-1" style={{ color: 'var(--steel)' }}>{row.label}</p>
              <p className="body-sm" style={{ color: 'var(--charcoal)' }}>{row.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Next Project ─────────────────────────────────── */}
      <Link
        href={`/projects/${next.slug}`}
        className="block relative group overflow-hidden"
        style={{ backgroundColor: 'var(--navy)', minHeight: '240px' }}
        data-dark
        data-cursor="view"
      >
        <div
          className="absolute inset-0 img-placeholder opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{ backgroundColor: '#1e2d3e' }}
        />
        <div className="relative z-10 flex items-center justify-between h-full px-8 md:px-14 py-16">
          <span className="label" style={{ color: 'var(--steel)' }}>Next Project →</span>
          <h2
            className="font-cormorant italic text-right"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.1 }}
          >
            {next.title}
          </h2>
        </div>
      </Link>

      <Footer />
    </>
  )
}
