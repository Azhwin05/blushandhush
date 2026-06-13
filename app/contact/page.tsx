'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Hospitality',
  'Bespoke Furniture',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Your name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'A valid email is required'
    if (!form.message.trim()) e.message = 'Please tell us about your project'
    return e
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSent(true)
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <>
      <Nav />

      <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen pt-[72px]">
        {/* Left — navy */}
        <div
          className="flex flex-col justify-between px-10 md:px-16 py-16"
          style={{ backgroundColor: 'var(--navy)' }}
          data-dark
        >
          <div>
            <h1
              className="font-cormorant italic"
              style={{ fontSize: 'clamp(38px, 5vw, 52px)', fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.2, marginBottom: '32px' }}
            >
              Begin your<br />project.
            </h1>
            <p className="body-lg mb-8" style={{ color: 'var(--steel)' }}>
              We work with a limited number of clients each year to ensure every project receives our full attention and craft.
            </p>
            <span className="gold-rule block mb-8" />

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <p className="label mb-1" style={{ color: 'var(--steel)' }}>Chennai Studio</p>
                <p className="body-sm" style={{ color: 'var(--ivory)' }}>By appointment — reach us at</p>
                <p className="body-sm" style={{ color: 'var(--gold)' }}>hello@blushandhush.in</p>
              </div>
              <div>
                <p className="label mb-1" style={{ color: 'var(--steel)' }}>Response time</p>
                <p className="body-sm" style={{ color: 'var(--ivory)' }}>Within 2 business days</p>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-6">
            {['Instagram', 'Pinterest', 'LinkedIn'].map((s) => (
              <a
                key={s}
                href={`https://${s.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="label"
                style={{ color: 'var(--steel)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ivory)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--steel)')}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Right — ivory / form */}
        <div
          className="flex flex-col justify-center px-10 md:px-16 py-16"
          style={{ backgroundColor: 'var(--ivory)' }}
        >
          {sent ? (
            <div>
              <span className="gold-rule block mb-8" />
              <h2
                className="font-cormorant italic"
                style={{ fontSize: '32px', fontWeight: 300, color: 'var(--navy)' }}
              >
                Thank you. We&rsquo;ll be in touch within 2 business days.
              </h2>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
              <p className="label" style={{ color: 'var(--steel)' }}>Tell us about your project</p>

              {/* Name */}
              <div>
                <input
                  className="input-underline"
                  placeholder="Your name"
                  value={form.name}
                  onChange={set('name')}
                />
                {errors.name && <p className="label-sm mt-1" style={{ color: 'var(--gold)' }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  className="input-underline"
                  placeholder="Email address"
                  value={form.email}
                  onChange={set('email')}
                />
                {errors.email && <p className="label-sm mt-1" style={{ color: 'var(--gold)' }}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  className="input-underline"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>

              {/* Project type */}
              <div>
                <select
                  className="input-underline"
                  value={form.type}
                  onChange={set('type')}
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="" disabled>Project type</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <textarea
                  className="input-underline"
                  rows={4}
                  placeholder="Tell us more..."
                  value={form.message}
                  onChange={set('message')}
                  style={{ resize: 'none', borderBottom: '0.5px solid var(--linen)' }}
                />
                {errors.message && <p className="label-sm mt-1" style={{ color: 'var(--gold)' }}>{errors.message}</p>}
              </div>

              <button type="submit" className="btn-primary btn-navy w-full mt-2">
                <span>Send enquiry →</span>
              </button>
              <p className="body-sm text-center" style={{ color: 'var(--steel)' }}>
                We&rsquo;ll reply within 2 business days.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
