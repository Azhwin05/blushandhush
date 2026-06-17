'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Loader from '@/components/Loader'
import MarqueeStrip from '@/components/MarqueeStrip'
import TextScramble from '@/components/TextScramble'
import Footer from '@/components/Footer'
import { projects, products } from '@/lib/data'

export default function HomePage() {
  const [loaderDone, setLoaderDone] = useState(false)
  const [scrambleTrigger, setScrambleTrigger] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Parallax hero on scroll
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const handleScroll = () => {
      const offset = window.scrollY * 0.4
      hero.style.transform = `translateY(${offset}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLoaderComplete = () => {
    setLoaderDone(true)
    setTimeout(() => setScrambleTrigger(true), 200)
  }

  const featured = projects.slice(0, 3)
  const featuredProduct = products[0]

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      <Nav />

      {/* ── 1.2 HERO ───────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden flex items-end" style={{ backgroundColor: 'var(--navy)' }}>
        {/* Background placeholder */}
        <div
          ref={heroRef}
          className="absolute inset-0 scale-110 img-placeholder"
          style={{ backgroundColor: '#1a2a3a' }}
        >
          <span style={{ color: 'var(--steel)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%,50%)' }}>
            Photography placeholder: Hero — atmospheric interior
          </span>
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(14,27,46,0.3) 0%, rgba(14,27,46,0.7) 100%)' }}
        />

        {/* Content — bottom left */}
        <div className="relative z-10 px-10 md:px-14 pb-12 md:pb-16 max-w-2xl">
          <p className="label mb-5" style={{ color: 'var(--gold)' }}>
            Est. Chennai · Interior Architecture
          </p>

          <h1
            className="font-cormorant italic mb-6 text-ivory leading-[1.05]"
            style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 300 }}
          >
            <TextScramble
              text="Where space meets intention."
              trigger={scrambleTrigger}
            />
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <span className="gold-rule" />
            <p className="label-sm" style={{ color: 'var(--steel)' }}>
              Bespoke interiors for the considered life
            </p>
          </div>

          <Link href="/projects" className="btn-primary btn-ivory" data-cursor="view">
            <span>View our work →</span>
          </Link>
        </div>

        {/* Scroll indicator — right side */}
        <div
          className="absolute right-8 bottom-1/2 translate-y-1/2 z-10 hidden md:block"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg) translateY(-50%)',
          }}
        >
          <span className="label" style={{ color: 'var(--steel)' }}>Scroll to explore</span>
        </div>
      </section>

      {/* ── 1.4 FEATURED PROJECTS GRID ─────────────────────── */}
      <section className="py-24 px-6 md:px-10" style={{ backgroundColor: 'var(--ivory)' }}>
        <div
          className="grid gap-[3px] project-grid grid-cols-1 md:grid-cols-3"
          style={{
            backgroundColor: 'var(--navy)',
          }}
        >
          {/* Hero card — spans 2 cols × 2 rows */}
          {featured[0] && (
            <ProjectCard project={featured[0]} number="01" className="md:col-span-2 md:row-span-2" tall />
          )}
          {featured[1] && (
            <ProjectCard project={featured[1]} number="02" />
          )}
          {featured[2] && (
            <ProjectCard project={featured[2]} number="03" />
          )}
          {/* Wide card — full width bottom */}
          {projects[3] && (
            <div className="md:col-span-3">
              <ProjectCard project={projects[3]} number="04" wide />
            </div>
          )}
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between flex-wrap gap-y-3 mt-8">
          <p className="label" style={{ color: 'var(--steel)' }}>
            {projects.length} completed projects across India &amp; UAE
          </p>
          <Link
            href="/projects"
            className="font-cormorant italic"
            style={{ color: 'var(--navy)', fontSize: '18px', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            View all work →
          </Link>
        </div>
      </section>

      {/* ── 1.5 PHILOSOPHY ─────────────────────────────────── */}
      <section
        className="py-[120px] px-6 text-center"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <div className="flex justify-center mb-8">
          <span className="gold-rule" />
        </div>
        <blockquote
          className="font-cormorant italic mx-auto max-w-2xl"
          style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.3 }}
        >
          &ldquo;We don&rsquo;t decorate spaces.<br />
          We author the way people<br />
          feel inside them.&rdquo;
        </blockquote>
        <p className="label mt-8" style={{ color: 'var(--steel)' }}>
          — Blush &amp; Hush Design Studio, Chennai
        </p>
      </section>

      {/* ── 1.6 MARQUEE ────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── 1.7 STATS ──────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {[
          { num: '14', label: 'Projects', sub: 'Across India & UAE', dark: false },
          { num: '7', label: 'Years', sub: 'In Practice', dark: true },
          { num: '3', label: 'Awards', sub: '& Recognitions', dark: false },
          { num: '∞', label: 'Details', sub: 'In Every Finish', dark: true },
        ].map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
            style={{ backgroundColor: s.dark ? 'var(--navy)' : 'var(--ivory)' }}
          >
            <span
              className="font-cormorant block"
              style={{
                fontSize: '72px',
                fontWeight: 300,
                lineHeight: 1,
                color: s.dark ? 'rgba(245,240,232,0.12)' : 'rgba(14,27,46,0.1)',
                marginBottom: '-8px',
              }}
            >
              {s.num}
            </span>
            <span
              className="label mt-2"
              style={{ color: s.dark ? 'var(--ivory)' : 'var(--navy)' }}
            >
              {s.label}
            </span>
            <span
              className="body-sm mt-1"
              style={{ color: 'var(--steel)' }}
            >
              {s.sub}
            </span>
          </div>
        ))}
      </section>

      {/* ── 1.8 FEATURED PRODUCT ───────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
        {/* Left — product image */}
        <div
          className="img-placeholder aspect-[4/5] md:aspect-auto relative overflow-hidden"
          style={{ backgroundColor: '#1a1a18', minHeight: '400px' }}
          data-cursor="shop"
        >
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: 'var(--steel)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', padding: '16px' }}
          >
            Photography placeholder: {featuredProduct.name}
          </span>
        </div>

        {/* Right — product details */}
        <div className="flex flex-col justify-center px-10 md:px-16 py-16" style={{ backgroundColor: 'var(--ivory)' }}>
          <p className="label mb-4" style={{ color: 'var(--gold)' }}>
            New arrival — Shop
          </p>
          <h2
            className="font-cormorant italic mb-4"
            style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.2 }}
          >
            {featuredProduct.name}<br />{featuredProduct.subtitle}
          </h2>
          <p className="body-lg mb-4" style={{ color: 'var(--steel)' }}>
            {featuredProduct.description.slice(0, 120)}…
          </p>
          <p className="mb-8" style={{ color: 'var(--gold)', fontSize: '18px', fontFamily: 'var(--font-dm-sans)' }}>
            ₹{featuredProduct.price.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/shop/${featuredProduct.slug}`} className="btn-primary btn-navy" data-cursor="shop">
              <span>View product →</span>
            </Link>
            <Link
              href={`/shop/${featuredProduct.slug}`}
              className="btn-secondary"
              style={{ color: 'var(--navy)' }}
            >
              Add to cart
            </Link>
          </div>
        </div>
      </section>

      {/* ── 1.9 CLIENT QUOTE ───────────────────────────────── */}
      <section
        className="py-[120px] px-6 flex flex-col items-center text-center"
        style={{ backgroundColor: 'var(--navy)' }}
        data-dark
      >
        <blockquote
          className="font-cormorant italic max-w-[700px] mx-auto"
          style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.4 }}
        >
          &ldquo;They didn&rsquo;t just design our home.<br />
          They designed how we live in it.&rdquo;
        </blockquote>
        <div className="flex justify-center my-6">
          <span className="gold-rule" style={{ width: '24px' }} />
        </div>
        <p className="label" style={{ color: 'var(--steel)' }}>
          — Priya &amp; Karthik Iyer, Whitefield Villa, Bengaluru
        </p>
      </section>

      {/* ── 1.10 CONTACT CTA STRIP ─────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
        {/* Left */}
        <div
          className="flex flex-col justify-center px-6 md:px-16 py-16"
          style={{ backgroundColor: 'var(--navy)' }}
          data-dark
        >
          <h2
            className="font-cormorant italic mb-6"
            style={{ fontSize: 'clamp(32px, 4vw, 42px)', fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.2 }}
          >
            Begin your<br />project.
          </h2>
          <p className="body-lg mb-6" style={{ color: 'var(--steel)' }}>
            We take on a limited number of projects each year. Enquiries open now.
          </p>
          <div>
            <p className="label-sm mb-1" style={{ color: 'var(--gold)' }}>
              hello@blushandhush.in
            </p>
            <p className="label-sm" style={{ color: 'var(--gold)' }}>
              Chennai · By appointment
            </p>
          </div>
        </div>

        {/* Right — mini contact form */}
        <div className="flex flex-col justify-center px-6 md:px-16 py-16" style={{ backgroundColor: 'var(--ivory)' }}>
          <MiniContactForm />
        </div>
      </section>

      <Footer />
    </>
  )
}

/* ── Project Card ────────────────────────────────────────── */
function ProjectCard({
  project,
  number,
  className = '',
  tall,
  wide,
}: {
  project: typeof projects[0]
  number: string
  className?: string
  tall?: boolean
  wide?: boolean
}) {
  return (
    <div
      className={`relative group overflow-hidden cursor-pointer ${className}`}
      style={{
        backgroundColor: 'var(--navy)',
        minHeight: tall ? '440px' : wide ? '220px' : '220px',
      }}
      data-cursor="view"
    >
      {/* Image placeholder */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ backgroundColor: '#1e2d3e', opacity: 0.7 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', padding: '16px' }}
        >
          Photography placeholder: {project.title}
        </span>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ backgroundColor: 'rgba(14,27,46,0.5)' }}
      />

      {/* Project number */}
      <span
        className="absolute top-4 left-4 label"
        style={{ color: 'var(--gold)' }}
      >
        {number}
      </span>

      {/* Title — clip-path reveal on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-6 overflow-hidden">
        <div
          className="transition-transform duration-500"
          style={{ transform: 'translateY(100%)', transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)' }}
        >
          {/* Using inline style trick for CSS-only reveal */}
        </div>
        <h3
          className="font-cormorant italic text-ivory"
          style={{ fontSize: '24px', fontWeight: 300, lineHeight: 1.2, color: 'var(--ivory)' }}
        >
          {project.title}
        </h3>
        <p className="label-sm mt-1" style={{ color: 'var(--steel)' }}>
          {project.type} · {project.location}
        </p>
      </div>

      {/* Invisible link */}
      <Link href={`/projects/${project.slug}`} className="absolute inset-0" aria-label={project.title} />
    </div>
  )
}

/* ── Mini Contact Form ───────────────────────────────────── */
function MiniContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Your name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'A valid email is required'
    if (!form.message.trim()) e.message = 'Tell us about your project'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <span className="gold-rule mb-4" />
        <p className="font-cormorant italic" style={{ fontSize: '24px', color: 'var(--navy)', fontWeight: 300 }}>
          Thank you. We&rsquo;ll be in touch within 2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <input
          className="input-underline"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="label-sm mt-1" style={{ color: 'var(--gold)' }}>{errors.name}</p>}
      </div>
      <div>
        <input
          className="input-underline"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="label-sm mt-1" style={{ color: 'var(--gold)' }}>{errors.email}</p>}
      </div>
      <div>
        <input
          className="input-underline"
          placeholder="Tell us about your project"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        {errors.message && <p className="label-sm mt-1" style={{ color: 'var(--gold)' }}>{errors.message}</p>}
      </div>
      <button type="submit" className="btn-primary btn-navy w-full">
        <span>Send enquiry →</span>
      </button>
    </form>
  )
}
