'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { projects } from '@/lib/data'

const FILTERS = ['All', 'Residential', 'Commercial', 'Hospitality', 'Furniture'] as const
type Filter = typeof FILTERS[number]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.type === activeFilter)

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
          Our Work
        </h1>
      </header>

      {/* Filter row */}
      <div
        className="flex items-center gap-8 px-6 md:px-10 py-6 overflow-x-auto"
        style={{ backgroundColor: 'var(--ivory)', borderBottom: '0.5px solid var(--linen)' }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="label whitespace-nowrap pb-1 transition-colors duration-200"
            style={{
              color: activeFilter === f ? 'var(--navy)' : 'var(--steel)',
              borderBottom: activeFilter === f ? '0.5px solid var(--gold)' : '0.5px solid transparent',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects list */}
      <main
        className="px-6 md:px-10 py-16"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <div className="flex flex-col divide-y" style={{ borderTop: '0.5px solid var(--linen)', borderColor: 'var(--linen)' }}>
          {filtered.map((project, i) => (
            <ProjectListItem key={project.slug} project={project} number={String(i + 1).padStart(2, '0')} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

function ProjectListItem({
  project,
  number,
}: {
  project: typeof projects[0]
  number: string
}) {
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 100 })
  }

  return (
    <div
      className="relative group py-8 cursor-pointer overflow-hidden project-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      data-cursor="view"
    >
      {/* Floating preview image */}
      <div
        className="pointer-events-none absolute z-10 transition-opacity duration-300"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: '280px',
          height: '200px',
          opacity: hovered ? 1 : 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {project.hero ? (
          <img src={project.hero} alt={project.title} className="w-full h-full object-cover" style={{ display: 'block' }} />
        ) : (
          <div className="w-full h-full img-placeholder" style={{ backgroundColor: '#1e2d3e' }}>
            <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
              {project.title}
            </span>
          </div>
        )}
      </div>

      {/* Row content */}
      <div className="flex items-baseline gap-6 md:gap-10 relative z-0">
        <span className="label flex-shrink-0 w-8" style={{ color: 'var(--gold)' }}>
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h2
            className="font-cormorant italic transition-colors duration-200"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 300,
              color: hovered ? 'var(--navy)' : 'var(--charcoal)',
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h2>
          <p className="label-sm mt-1" style={{ color: 'var(--steel)' }}>
            {project.type} · {project.location}
          </p>
        </div>
        <span
          className="label flex-shrink-0 hidden md:block transition-transform duration-300"
          style={{
            color: 'var(--steel)',
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          {project.year}
        </span>
        <span
          className="label flex-shrink-0"
          style={{
            color: hovered ? 'var(--navy)' : 'var(--steel)',
            transition: 'color 0.2s',
          }}
        >
          →
        </span>
      </div>

      {/* Invisible full-area link */}
      <Link href={`/projects/${project.slug}`} className="absolute inset-0" aria-label={project.title} />
    </div>
  )
}
