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

  // Horizontal scroll gallery — CSS sticky for pinning, GSAP only for x translation
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return

    let mounted = true
    let cleanup: (() => void) | undefined

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (!mounted) return

      gsap.registerPlugin(ScrollTrigger)

      const gallery = galleryRef.current
      const track = trackRef.current
      if (!gallery || !track) return

      // Give the outer section enough height for the horizontal scroll distance
      const setHeight = () => {
        gallery.style.height = `${window.innerHeight + track.scrollWidth - window.innerWidth}px`
      }
      setHeight()

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: gallery,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: setHeight,
          },
        })
      })

      cleanup = () => ctx.revert()
    })()

    return () => {
      mounted = false
      cleanup?.()
    }
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
        <div className="absolute inset-0">
          {project.hero ? (
            <img src={project.hero} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 img-placeholder" style={{ backgroundColor: '#1a2a3a' }}>
              <span
                className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2"
                style={{ color: 'var(--steel)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center' }}
              >
                Photography placeholder: {project.title} hero
              </span>
            </div>
          )}
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
          className="font-cormorant italic min-w-0 truncate"
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

      {/* ── Horizontal Photo Gallery (desktop only) ──────── */}
      <section ref={galleryRef} data-cursor="drag" className="hidden md:block">
        {/* Sticky viewport — CSS handles the pin, no GSAP DOM changes */}
        <div className="sticky top-0 overflow-hidden" style={{ height: '100vh' }}>
          <div
            ref={trackRef}
            className="flex h-full"
            style={{ width: 'max-content' }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{ width: '85vw', height: '100vh', marginRight: '3px', position: 'relative', overflow: 'hidden' }}
              >
                {img ? (
                  <img
                    src={img}
                    alt={`${project.title} — ${i + 1}`}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="absolute inset-0 img-placeholder" style={{ backgroundColor: `hsl(${210 + i * 8}, 30%, ${15 + i * 3}%)` }}>
                    <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Photography placeholder: {project.title} — {i + 1}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile gallery — vertical */}
      <section className="md:hidden flex flex-col gap-[3px] px-4 py-10" style={{ backgroundColor: 'var(--ivory)' }}>
        {galleryImages.map((img, i) => (
          <div key={i} className="w-full" style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
            {img ? (
              <img src={img} alt={`${project.title} — ${i + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="w-full h-full img-placeholder" style={{ backgroundColor: `hsl(${210 + i * 8}, 30%, ${15 + i * 3}%)` }}>
                <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Photography placeholder: {project.title} — {i + 1}
                </span>
              </div>
            )}
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
