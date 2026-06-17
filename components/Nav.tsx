'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'Work', href: '/projects' },
  { label: 'Studio', href: '/studio' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-8 md:px-12 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'var(--ivory)' : 'transparent',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <Image
            src={scrolled ? '/logo-navy.png' : '/logo-ivory.png'}
            alt="Blush & Hush"
            width={88}
            height={44}
            priority
            className="transition-opacity duration-500"
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-10 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link"
                style={{ color: scrolled ? 'var(--steel)' : 'var(--ivory)' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/contact"
            className="btn-primary"
            style={{
              color: scrolled ? 'var(--navy)' : 'var(--ivory)',
              borderColor: scrolled ? 'var(--navy)' : 'var(--ivory)',
            }}
          >
            <span>Enquire →</span>
          </Link>
        </div>

        {/* Mobile: "Menu" or "Close" */}
        <button
          className="md:hidden label"
          style={{ color: scrolled ? 'var(--navy)' : 'var(--ivory)' }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999] flex flex-col justify-center px-10 md:hidden transition-all duration-500"
        style={{
          backgroundColor: 'var(--navy)',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <ul className="list-none flex flex-col gap-6">
          {[...navLinks, { label: 'Enquire', href: '/contact' }].map((link, i) => (
            <li
              key={link.href + i}
              style={{
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transition: `transform 0.4s ease ${i * 0.08}s, opacity 0.4s ease ${i * 0.08}s`,
              }}
            >
              <Link
                href={link.href}
                onClick={closeMenu}
                className="font-cormorant italic text-ivory"
                style={{ fontSize: '48px', lineHeight: 1.1, color: 'var(--ivory)', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom info */}
        <div
          className="absolute bottom-10 left-10 right-10"
          style={{
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 0.4s ease 0.4s',
          }}
        >
          <p className="label" style={{ color: 'var(--steel)' }}>
            hello@blushandhush.in · Chennai
          </p>
        </div>
      </div>
    </>
  )
}
