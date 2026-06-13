import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--navy)' }} data-dark>
      {/* Main columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-10 md:px-14 py-16 md:py-20">
        {/* Col 1 — Logo */}
        <div className="flex flex-col gap-4 relative">
          <Image
            src="/logo-ivory.svg"
            alt="Blush & Hush"
            width={160}
            height={56}
          />
          {/* Watermark logo behind */}
          <div
            className="absolute top-0 left-0 pointer-events-none select-none"
            style={{ opacity: 0.06 }}
          >
            <Image
              src="/logo-ivory.svg"
              alt=""
              width={320}
              height={112}
              aria-hidden="true"
            />
          </div>
          <p className="body-sm mt-6" style={{ color: 'var(--steel)', maxWidth: '280px' }}>
            Interior architecture and bespoke design studio. Chennai, India.
          </p>
        </div>

        {/* Col 2 — Studio links */}
        <div className="flex flex-col gap-4 md:items-center">
          <p className="label mb-2" style={{ color: 'var(--steel)' }}>Studio</p>
          {[
            { label: 'Work', href: '/projects' },
            { label: 'About', href: '/studio' },
            { label: 'Services', href: '/services' },
            { label: 'Shop', href: '/shop' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              style={{ color: 'var(--steel)', fontSize: '10px' }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Col 3 — Connect */}
        <div className="flex flex-col gap-4 md:items-end">
          <p className="label mb-2" style={{ color: 'var(--steel)' }}>Connect</p>
          {[
            { label: 'Instagram', href: 'https://instagram.com' },
            { label: 'Pinterest', href: 'https://pinterest.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ color: 'var(--steel)', fontSize: '10px' }}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-4">
            <p className="body-sm" style={{ color: 'var(--steel)' }}>hello@blushandhush.in</p>
            <p className="body-sm" style={{ color: 'var(--steel)' }}>Chennai, Tamil Nadu</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row items-center justify-between px-10 md:px-14 py-5 gap-2"
        style={{ borderTop: '0.5px solid #1e3045' }}
      >
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', color: 'var(--steel)', letterSpacing: '0.06em' }}>
          © 2025 Blush &amp; Hush. All rights reserved.
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', color: 'var(--steel)', letterSpacing: '0.06em' }}>
          Crafted in Chennai
        </p>
      </div>
    </footer>
  )
}
