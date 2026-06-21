'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    Razorpay: any
  }
}

/* ── Colour tokens ──────────────────────────────────────────── */
const C = {
  terracotta:     '#C4622D',
  terracottaDark: '#A0491E',
  teak:           '#8B5E3C',
  teakLight:      '#B8845A',
  brass:          '#B5813A',
  brassLight:     '#D4A853',
  tealArt:        '#2D7D7D',
  tealDark:       '#1A5252',
  cream:          '#F7F0E6',
  creamMuted:     'rgba(247,240,230,0.6)',
  darkWood:       '#2C1810',
  warmWhite:      '#FBF6EE',
  navy:           '#0E1B2E',
  gold:           '#C8A96A',
  steel:          '#8A9BAE',
}

/* ── Fill-wipe button ───────────────────────────────────────── */
function SevButton({
  children,
  fullWidth = false,
  type = 'button',
  onClick,
  disabled = false,
}: {
  children: React.ReactNode
  fullWidth?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '0.5px solid rgba(247,240,230,0.6)',
        color: hovered ? C.terracotta : C.cream,
        padding: '16px 48px',
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '11px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        width: fullWidth ? '100%' : 'auto',
        display: 'block',
        transition: 'color 0.45s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.3s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.cream,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  )
}

/* ── Photo — real image or placeholder ──────────────────────── */
function Photo({
  label,
  bg,
  labelColor,
  minHeight = 480,
  className = '',
  src,
}: {
  label: string
  bg: string
  labelColor: string
  minHeight?: number
  className?: string
  src?: string
}) {
  if (src) {
    return (
      <div
        className={`w-full ${className}`}
        style={{ overflow: 'hidden', position: 'relative', ...(minHeight ? { minHeight } : { height: '100%' }) }}
      >
        <img
          src={src}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            ...(minHeight ? { minHeight } : {}),
          }}
        />
      </div>
    )
  }
  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      style={{ minHeight, backgroundColor: bg }}
    >
      <span
        style={{
          color: labelColor,
          fontSize: '9px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: '24px',
          fontFamily: 'var(--font-dm-sans)',
          lineHeight: 1.6,
          maxWidth: '240px',
        }}
      >
        {label}
      </span>
    </div>
  )
}

/* ── 40px brass rule ────────────────────────────────────────── */
function BrassRule({ color = C.brassLight }: { color?: string }) {
  return (
    <div
      style={{
        width: '40px',
        height: '0.5px',
        backgroundColor: color,
        margin: '24px 0',
        flexShrink: 0,
      }}
    />
  )
}

/* ── Spec table row ─────────────────────────────────────────── */
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderBottom: '0.5px solid #E8E0D5' }}>
      <td
        style={{
          padding: '13px 16px 13px 0',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '9px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: C.steel,
          width: '120px',
          verticalAlign: 'top',
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: '13px 0',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '14px',
          color: C.darkWood,
          lineHeight: 1.6,
        }}
      >
        {value}
      </td>
    </tr>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE COMPONENT                                             */
/* ═══════════════════════════════════════════════════════════ */
export default function SevvagamPage() {
  const heroImgRef    = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', message: '',
  })
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [focused, setFocused]       = useState<string | null>(null)
  const [submitted, setSubmitted]   = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null)
  const [paymentError, setPaymentError]     = useState<string | null>(null)

  /* ── GSAP ─────────────────────────────────────────────── */
  useEffect(() => {
    let ctx: any

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        /* Hero product entrance */
        if (heroImgRef.current) {
          gsap.fromTo(heroImgRef.current,
            { scale: 1.04, opacity: 0 },
            { scale: 1, opacity: 1, duration: 2, ease: 'power1.out', delay: 0.3 }
          )
        }

        /* Scroll line grow */
        if (scrollLineRef.current) {
          gsap.fromTo(scrollLineRef.current,
            { height: 0 },
            { height: '40px', duration: 1, ease: 'power2.out', delay: 1.6 }
          )
        }

        /* Hero parallax */
        gsap.to('.sevvagam-hero-img', {
          y: '-8%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.sevvagam-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        /* Image reveals */
        gsap.utils.toArray<HTMLElement>('.reveal-img').forEach((el) => {
          gsap.fromTo(el,
            { scale: 1.06, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 85%' } }
          )
        })

        /* Heading reveals */
        gsap.utils.toArray<HTMLElement>('.reveal-heading').forEach((el) => {
          gsap.fromTo(el,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 88%' } }
          )
        })

        /* Body text reveals */
        gsap.utils.toArray<HTMLElement>('.reveal-body').forEach((el) => {
          gsap.fromTo(el,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 88%' } }
          )
        })

        /* Material panel slide-in */
        gsap.utils.toArray<HTMLElement>('.material-panel').forEach((el, i) => {
          gsap.fromTo(el,
            { x: i % 2 === 0 ? -30 : 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.1, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 80%' } }
          )
        })
      })
    }

    const t = setTimeout(init, 120)
    return () => { clearTimeout(t); ctx?.revert() }
  }, [])

  /* ── Razorpay script ──────────────────────────────────── */
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  /* ── Form ─────────────────────────────────────────────── */
  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `0.5px solid ${
      errors[field]
        ? C.brassLight
        : focused === field
        ? 'rgba(247,240,230,0.7)'
        : 'rgba(247,240,230,0.3)'
    }`,
    padding: '14px 0',
    color: C.cream,
    fontFamily: 'var(--font-dm-sans)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
    display: 'block',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!formData.name.trim())  errs.name    = 'Your name is required'
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'A valid email is required'
    if (!formData.message.trim()) errs.message = 'Please tell us about the space'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(true)
  }

  const handlePayment = async () => {
    setPaymentLoading(true)
    setPaymentError(null)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1_000_000 }),
      })
      if (!res.ok) throw new Error('Order creation failed')
      const order = await res.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Blush & Hush',
        description: 'Sevvagam Commission Deposit',
        order_id: order.order_id,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              setPaymentSuccess(response.razorpay_payment_id)
            } else {
              setPaymentError('Payment could not be verified. Please contact hello@blushandhush.in')
            }
          } catch {
            setPaymentError('Verification error. Please contact hello@blushandhush.in')
          } finally {
            setPaymentLoading(false)
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: C.terracotta },
        modal: { ondismiss: () => setPaymentLoading(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setPaymentError('Payment was not completed. Please try again.')
        setPaymentLoading(false)
      })
      rzp.open()
    } catch {
      setPaymentError('Something went wrong. Please try again or write to hello@blushandhush.in')
      setPaymentLoading(false)
    }
  }

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((f) => ({ ...f, [k]: e.target.value }))

  /* ── RENDER ───────────────────────────────────────────── */
  return (
    <main style={{ overflowX: 'hidden' }}>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO                                */}
      {/* ════════════════════════════════════════════════ */}
      <section
        className="sevvagam-hero relative overflow-hidden flex flex-col"
        style={{ backgroundColor: C.terracotta, height: '100vh', minHeight: '600px' }}
      >
        {/* Full-bleed background image */}
        <div
          ref={heroImgRef}
          className="sevvagam-hero-img absolute inset-0"
        >
          <img
            src="https://res.cloudinary.com/dmhonzqrm/image/upload/v1782055398/sevvaagam_7_lckvcr.jpg"
            alt="Sevvagam cabinet"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
          />
        </div>

        {/* Radial terracotta vignette — bleeds in from edges */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 65% 75% at center 40%, transparent 25%, rgba(196,98,45,0.55) 65%, ${C.terracotta} 100%)`,
        }} />

        {/* Top + bottom gradient for text legibility */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to bottom, rgba(196,98,45,0.72) 0%, transparent 22%, transparent 52%, rgba(196,98,45,0.8) 78%, ${C.terracotta} 100%)`,
        }} />

        {/* Top label */}
        <div className="relative z-10 flex justify-center" style={{ paddingTop: '48px' }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(247,240,230,0.6)',
          }}>
            B L U S H &nbsp;&amp;&nbsp; H U S H &nbsp;·&nbsp; P R E S E N T S
          </p>
        </div>

        <div className="flex-1" />

        {/* Tamil name + English name + tagline */}
        <div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ paddingBottom: '80px', gap: '6px' }}
        >
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '18px',
            color: 'rgba(247,240,230,0.7)',
            lineHeight: 1.2,
          }}>
            செவ்வகம்
          </p>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(48px, 7vw, 64px)',
            color: C.cream,
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
          }}>
            Sevvagam
          </h1>
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: C.brassLight,
            marginTop: '8px',
          }}>
            C R A F T E D &nbsp; A R O U N D &nbsp; A R T .
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div
            ref={scrollLineRef}
            style={{ width: '0.5px', height: 0, backgroundColor: 'rgba(247,240,230,0.3)' }}
          />
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(247,240,230,0.4)',
          }}>
            Explore
          </p>
        </div>
      </section>

      {/* Gradient bridge: terracotta → cream */}
      <div style={{
        background: `linear-gradient(to bottom, ${C.terracotta} 0%, ${C.cream} 100%)`,
        height: '80px',
      }} />

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 2 — OBJECT STATEMENT                   */}
      {/* ════════════════════════════════════════════════ */}
      <section className="px-6 py-16 md:py-[120px]" style={{ backgroundColor: C.cream }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <p className="reveal-heading" style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.brass,
          }}>
            The Object · No. 01 · Limited Edition
          </p>

          <h2 className="reveal-heading" style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(30px, 5vw, 52px)',
            color: C.darkWood,
            lineHeight: 1.2,
            marginTop: '20px',
          }}>
            A cabinet built not<br />to contain — but to reveal.
          </h2>

          <p className="reveal-body" style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '16px',
            color: C.teak,
            lineHeight: 1.9,
            maxWidth: '520px',
            margin: '32px auto 0',
          }}>
            Sevvagam is a study in restraint. Four walls of solid teak,
            four corners of hand-cast brass, and one perfectly framed
            work of traditional Indian art.
            <br /><br />
            It does not decorate a room.<br />
            It gives a room something to speak to.
          </p>
        </div>

        {/* Full-width product image */}
        <div className="reveal-img" style={{ marginTop: '64px' }}>
          <Photo
            label="Photography: Sevvagam — front view, full product"
            bg={`rgba(139,94,60,0.1)`}
            labelColor={`rgba(139,94,60,0.35)`}
            minHeight={560}
            src="https://res.cloudinary.com/dmhonzqrm/image/upload/v1782055398/sevvaagam_4_ukubsn.jpg"
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 3 — MATERIAL BREAKDOWN                 */}
      {/* ════════════════════════════════════════════════ */}

      {/* Panel A — TEAK · cream bg · image left, text right */}
      <section
        className="material-panel grid grid-cols-1 md:grid-cols-2"
        style={{ backgroundColor: C.cream }}
      >
        <div className="reveal-img min-h-[300px] md:min-h-[480px]">
          <Photo
            label="Photography: Teak wood grain — extreme close-up"
            bg="rgba(139,94,60,0.13)"
            labelColor="rgba(139,94,60,0.3)"
            minHeight={300}
            className="h-full"
            src="https://res.cloudinary.com/dmhonzqrm/image/upload/v1782055395/sevvaagam_5_fie41p.jpg"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-12 md:px-16 md:py-20">
          <p className="reveal-heading" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
            letterSpacing: '0.16em', textTransform: 'uppercase', color: C.brass,
          }}>
            01 — Primary Material
          </p>
          <h3 className="reveal-heading" style={{
            fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.darkWood,
            lineHeight: 1.15, marginTop: '16px',
          }}>
            Solid Teak
          </h3>
          <BrassRule />
          <p className="reveal-body" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '15px',
            color: C.teak, lineHeight: 1.9,
          }}>
            Sourced from responsibly managed forests, the teak used in
            Sevvagam is chosen for depth of grain and richness of tone.
            <br /><br />
            Each cabinet is unique. The wood&rsquo;s natural variations —
            its knots, its grain shifts, its warmth — are not hidden.
            They are the design.
          </p>
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.steel }}>
              Origin — South India
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.steel }}>
              Finish — Natural oil, hand-applied
            </p>
          </div>
        </div>
      </section>

      {/* Panel B — BRASS · dark-wood bg · image top (mobile), text left (desktop) */}
      <section
        className="material-panel grid grid-cols-1 md:grid-cols-2"
        style={{ backgroundColor: C.darkWood }}
      >
        <div className="flex flex-col justify-center px-6 py-12 md:px-16 md:py-20 order-2 md:order-1">
          <p className="reveal-heading" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
            letterSpacing: '0.16em', textTransform: 'uppercase', color: C.brassLight,
          }}>
            02 — Hardware
          </p>
          <h3 className="reveal-heading" style={{
            fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.cream,
            lineHeight: 1.15, marginTop: '16px',
          }}>
            Hand-cast Brass
          </h3>
          <BrassRule color={C.brassLight} />
          <p className="reveal-body" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '15px',
            color: 'rgba(247,240,230,0.7)', lineHeight: 1.9,
          }}>
            The four corner rosettes and pull handle are individually
            cast in solid brass using the lost-wax method.
            <br /><br />
            Each piece is finished by hand — lightly burnished, never
            over-polished. They carry a trace of the maker&rsquo;s touch
            intentionally.
          </p>
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(247,240,230,0.4)' }}>
              Technique — Lost-wax casting
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(247,240,230,0.4)' }}>
              Placement — Four corners + one pull handle
            </p>
          </div>
        </div>
        <div className="reveal-img min-h-[300px] md:min-h-[480px] order-1 md:order-2">
          <Photo
            label="Photography: Brass corner rosette — extreme close-up"
            bg="rgba(181,129,58,0.18)"
            labelColor="rgba(212,168,83,0.3)"
            minHeight={300}
            className="h-full"
            src="https://res.cloudinary.com/dmhonzqrm/image/upload/v1782055403/sevvaagam_6_zdbcqg.jpg"
          />
        </div>
      </section>

      {/* Panel C — CANE · cream bg · image left, text right */}
      <section
        className="material-panel grid grid-cols-1 md:grid-cols-2"
        style={{ backgroundColor: C.cream }}
      >
        <div className="reveal-img min-h-[300px] md:min-h-[480px]">
          <Photo
            label="Photography: Woven cane plinth — basket-weave pattern"
            bg="rgba(196,98,45,0.09)"
            labelColor="rgba(196,98,45,0.3)"
            minHeight={300}
            className="h-full"
            src="https://res.cloudinary.com/dmhonzqrm/image/upload/v1782055403/sevvaagam_2_f0wj7z.jpg"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-12 md:px-16 md:py-20">
          <p className="reveal-heading" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
            letterSpacing: '0.16em', textTransform: 'uppercase', color: C.brass,
          }}>
            03 — Base
          </p>
          <h3 className="reveal-heading" style={{
            fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.darkWood,
            lineHeight: 1.15, marginTop: '16px',
          }}>
            Woven Cane
          </h3>
          <BrassRule />
          <p className="reveal-body" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '15px',
            color: C.teak, lineHeight: 1.9,
          }}>
            The plinth is hand-woven by artisans following the
            basket-weave tradition of Thanjavur.
            <br /><br />
            The weave is not decorative. It is structural — the tight
            pattern distributes weight evenly while connecting Sevvagam
            to centuries of Tamil craft heritage.
          </p>
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.steel }}>
              Origin — Thanjavur, Tamil Nadu
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.steel }}>
              Pattern — Traditional basket weave
            </p>
          </div>
        </div>
      </section>

      {/* Panel D — KALAMKARI · teal-art bg · image top (mobile), text left (desktop) */}
      <section
        className="material-panel grid grid-cols-1 md:grid-cols-2"
        style={{ backgroundColor: C.tealArt }}
      >
        <div className="flex flex-col justify-center px-6 py-12 md:px-16 md:py-20 order-2 md:order-1">
          <p className="reveal-heading" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(247,240,230,0.6)',
          }}>
            04 — Centre Panel
          </p>
          <h3 className="reveal-heading" style={{
            fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.cream,
            lineHeight: 1.15, marginTop: '16px',
          }}>
            Kalamkari Art
          </h3>
          <BrassRule color="rgba(247,240,230,0.3)" />
          <p className="reveal-body" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '15px',
            color: 'rgba(247,240,230,0.75)', lineHeight: 1.9,
          }}>
            The centre tile is an original work in the Srikalahasti
            Kalamkari tradition — a style that uses natural dyes on
            cotton, with outlines drawn using a bamboo pen (kalam).
            <br /><br />
            The peacock depicted is a classical Kalamkari motif — a
            symbol of beauty, grace and the arrival of rain. Each tile
            is painted by a single artist. No two are the same.
          </p>
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              'Style — Srikalahasti Kalamkari',
              'Medium — Natural dye on cotton',
              'Artist — Hand-signed on reverse',
            ].map((line) => (
              <p key={line} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(247,240,230,0.4)' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="reveal-img min-h-[300px] md:min-h-[480px] order-1 md:order-2">
          <Photo
            label="Photography: Kalamkari peacock tile — full panel"
            bg="rgba(26,82,82,0.45)"
            labelColor="rgba(247,240,230,0.2)"
            minHeight={300}
            className="h-full"
            src="https://res.cloudinary.com/dmhonzqrm/image/upload/v1782055403/sevvaagam_3_h240bl.jpg"
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 4 — PRODUCT REPRISE                    */}
      {/* ════════════════════════════════════════════════ */}
      <section
        className="px-6 py-16 md:py-[120px] text-center"
        style={{ backgroundColor: C.darkWood }}
      >
        <div
          className="reveal-img"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div className="w-full md:max-w-[520px]">
            <Photo
              label="Photography: Sevvagam — on dark background, brass and teak illuminated"
              bg="rgba(60,20,10,0.55)"
              labelColor="rgba(212,168,83,0.28)"
              minHeight={500}
              src="https://res.cloudinary.com/dmhonzqrm/image/upload/v1782055395/sevvaagam_5_fie41p.jpg"
            />
          </div>
        </div>
        <p
          className="reveal-heading"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: C.brassLight,
            marginTop: '48px',
          }}
        >
          L I M I T E D &nbsp; E D I T I O N &nbsp;·&nbsp; M A D E &nbsp; I N &nbsp; C H E N N A I
        </p>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 5 — SPECIFICATIONS                     */}
      {/* ════════════════════════════════════════════════ */}
      <section className="px-6 py-14 md:py-[100px]" style={{ backgroundColor: C.cream }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p
            className="reveal-heading"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.brass,
              textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            Specifications
          </p>

          <table className="reveal-body" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <SpecRow label="Form"             value="Square cabinet with recessed art panel" />
              <SpecRow label="Primary material" value="Solid teak wood" />
              <SpecRow label="Hardware"         value="Hand-cast brass (4 rosettes + 1 handle)" />
              <SpecRow label="Base"             value="Hand-woven cane plinth" />
              <SpecRow label="Art panel"        value="Srikalahasti Kalamkari on cotton" />
              <SpecRow label="Art medium"       value="Natural mineral dyes, bamboo kalam" />
              <SpecRow label="Edition"          value="Limited · Each piece numbered" />
              <SpecRow label="Signed"           value="By the Kalamkari artist, on reverse" />
              <SpecRow label="Certificate"      value="Included — documents materials & makers" />
              <SpecRow label="Lead time"        value="4–6 weeks from commission" />
              <SpecRow label="Made in"          value="Chennai, Tamil Nadu, India" />
            </tbody>
          </table>

          <p
            className="reveal-body"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '18px',
              color: C.teak,
              textAlign: 'center',
              marginTop: '48px',
              lineHeight: 1.65,
            }}
          >
            &ldquo;Every Sevvagam is accompanied by the name of every hand that shaped it.&rdquo;
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 6 — COMMISSION CTA                     */}
      {/* ════════════════════════════════════════════════ */}
      <section
        className="px-6 pt-16 pb-12 md:pt-[120px] md:pb-[80px] text-center"
        style={{ backgroundColor: C.terracotta }}
      >
        <p
          className="reveal-heading"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(247,240,230,0.5)',
          }}
        >
          COMMISSION YOURS
        </p>

        <h2
          className="reveal-heading"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(38px, 6vw, 62px)',
            color: C.cream,
            lineHeight: 1.08,
            marginTop: '20px',
          }}
        >
          Own a piece of<br />living craft.
        </h2>

        <p
          className="reveal-body"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '16px',
            color: 'rgba(247,240,230,0.65)',
            maxWidth: '460px',
            margin: '28px auto 0',
            lineHeight: 1.85,
          }}
        >
          Sevvagam is made to order. Each cabinet is numbered, each art
          tile unique, each piece accompanied by full documentation of
          the artist and artisans who built it.
          <br /><br />
          Enquiries are handled personally by the Blush &amp; Hush
          studio team.
        </p>

        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(247,240,230,0.4)',
          marginTop: '20px',
        }}>
          Lead time — 4 to 6 weeks from commission date
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '48px' }}>
          <div className="w-full max-w-[380px]">
            <SevButton onClick={handlePayment} disabled={paymentLoading} fullWidth>
              {paymentLoading ? 'Opening payment…' : 'Pay Commission Deposit — ₹10,000 →'}
            </SevButton>
          </div>
          <button
            onClick={() => document.getElementById('commission-form')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(247,240,230,0.5)',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              padding: '8px 0',
            }}
          >
            Or send an enquiry →
          </button>
          {paymentError && (
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '12px',
              color: C.brassLight,
              textAlign: 'center',
              maxWidth: '360px',
              lineHeight: 1.7,
            }}>
              {paymentError}
            </p>
          )}
        </div>

        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '13px',
          color: 'rgba(247,240,230,0.35)',
          marginTop: '20px',
        }}>
          Or write to us — hello@blushandhush.in
        </p>
      </section>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 7 — ENQUIRY FORM                       */}
      {/* ════════════════════════════════════════════════ */}
      <div
        id="commission-form"
        className="px-6 pb-16 md:pb-[120px]"
        style={{ backgroundColor: C.terracotta }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Divider */}
          <div style={{ borderTop: '0.5px solid rgba(247,240,230,0.15)', marginBottom: '48px' }} />

          {paymentSuccess ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: C.brassLight,
              }}>
                Commission Secured
              </p>
              <h3 style={{
                fontFamily: 'var(--font-cormorant)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '28px',
                color: C.cream,
                marginTop: '16px',
                lineHeight: 1.4,
              }}>
                Your Sevvagam is reserved.
              </h3>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '14px',
                color: 'rgba(247,240,230,0.65)',
                marginTop: '20px',
                lineHeight: 1.85,
              }}>
                We have received your deposit. The studio will reach<br />
                out within one business day to begin the making process.
              </p>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '9px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(247,240,230,0.3)',
                marginTop: '28px',
              }}>
                Payment ref — {paymentSuccess}
              </p>
            </div>
          ) : submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <h3 style={{
                fontFamily: 'var(--font-cormorant)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '26px',
                color: C.cream,
                lineHeight: 1.45,
              }}>
                Thank you. We&rsquo;ll be in touch soon.
              </h3>
              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(247,240,230,0.5)',
                marginTop: '16px',
              }}>
                Our studio will reach out within 2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div style={{ marginBottom: errors.name ? '8px' : '32px' }}>
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  className="sev-input"
                  value={formData.name}
                  onChange={set('name')}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('name')}
                />
                {errors.name && (
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: C.brassLight, marginTop: '6px', marginBottom: '20px' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: errors.email ? '8px' : '32px' }}>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="sev-input"
                  value={formData.email}
                  onChange={set('email')}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('email')}
                />
                {errors.email && (
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: C.brassLight, marginTop: '6px', marginBottom: '20px' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '32px' }}>
                <input
                  type="tel"
                  placeholder="PHONE (OPTIONAL)"
                  className="sev-input"
                  value={formData.phone}
                  onChange={set('phone')}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('phone')}
                />
              </div>

              {/* City */}
              <div style={{ marginBottom: '32px' }}>
                <input
                  type="text"
                  placeholder="CITY / LOCATION"
                  className="sev-input"
                  value={formData.city}
                  onChange={set('city')}
                  onFocus={() => setFocused('city')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('city')}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: errors.message ? '8px' : '32px' }}>
                <textarea
                  placeholder="TELL US ABOUT THE SPACE SEVVAGAM WILL LIVE IN..."
                  className="sev-input"
                  rows={4}
                  value={formData.message}
                  onChange={set('message')}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputStyle('message'), resize: 'none', minHeight: '100px' }}
                />
                {errors.message && (
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', color: C.brassLight, marginTop: '6px', marginBottom: '20px' }}>
                    {errors.message}
                  </p>
                )}
              </div>

              <SevButton type="submit" fullWidth>
                Send commission enquiry →
              </SevButton>

              <p style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '13px',
                color: 'rgba(247,240,230,0.35)',
                textAlign: 'center',
                marginTop: '16px',
                lineHeight: 1.75,
              }}>
                We respond within 2 business days.<br />
                A member of our studio will reach out personally.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* SECTION 8 — BACK TO B&H                        */}
      {/* ════════════════════════════════════════════════ */}
      <div
        className="px-6 md:px-10 py-5 flex items-center justify-between flex-wrap gap-2"
        style={{ backgroundColor: C.navy }}
      >
        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.steel,
        }}>
          Blush &amp; Hush Interior Architecture
        </p>
        <BackLink />
      </div>

    </main>
  )
}

/* Inline hover for back link (avoids onMouse* inline on server) */
function BackLink() {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.gold,
        textDecoration: hovered ? 'underline' : 'none',
        textUnderlineOffset: '3px',
        transition: 'text-decoration 0.2s',
      }}
    >
      ← Back to studio
    </Link>
  )
}
