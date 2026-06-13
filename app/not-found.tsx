import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      style={{ backgroundColor: 'var(--navy)' }}
      data-dark
    >
      <p className="label mb-4" style={{ color: 'var(--gold)' }}>404</p>
      <h1
        className="font-cormorant italic mb-6"
        style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.2 }}
      >
        This page doesn&rsquo;t exist.
      </h1>
      <p className="body-lg mb-8" style={{ color: 'var(--steel)' }}>
        The space you were looking for has been moved or never existed.
      </p>
      <Link href="/" className="btn-primary btn-ivory" data-cursor="view">
        <span>Return home →</span>
      </Link>
    </main>
  )
}
