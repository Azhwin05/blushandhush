import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const team = [
  { name: 'Meera Krishnan', role: 'Founder & Principal Designer' },
  { name: 'Arun Balachandran', role: 'Head of Architecture' },
  { name: 'Divya Nair', role: 'Interior Design Lead' },
  { name: 'Rohan Mistry', role: 'Product Design' },
]

const awards = [
  { year: '2024', title: 'AD100 India — Studios to Watch', body: 'Architectural Digest India' },
  { year: '2023', title: 'Best Residential Interior, South India', body: 'Interior Design Awards' },
  { year: '2022', title: 'Emerging Studio of the Year', body: 'FOAID Chennai' },
]

export default function StudioPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <header
        className="flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: 'var(--navy)', minHeight: '50vh', padding: '120px 24px 80px' }}
        data-dark
      >
        <h1
          className="font-cormorant italic text-ivory"
          style={{ fontSize: 'clamp(52px, 7vw, 72px)', fontWeight: 300, lineHeight: 1.05 }}
        >
          Our Story
        </h1>
      </header>

      {/* Studio split */}
      <section className="grid grid-cols-1 md:grid-cols-[3fr_2fr]" style={{ minHeight: '600px' }}>
        {/* Left — studio photo */}
        <div
          className="img-placeholder"
          style={{ backgroundColor: '#1e2d3e', minHeight: '480px' }}
        >
          <span style={{ color: 'var(--steel)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Photography placeholder: Studio / Portrait
          </span>
        </div>

        {/* Right — text */}
        <div className="flex flex-col justify-center px-6 md:px-14 py-16" style={{ backgroundColor: 'var(--ivory)' }}>
          <p className="label mb-5" style={{ color: 'var(--gold)' }}>Est. Chennai · 2018</p>
          <h2
            className="font-cormorant italic mb-6"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.3 }}
          >
            We believe design is a tool to enhance humanity.
          </h2>
          <p className="body-lg mb-5" style={{ color: 'var(--charcoal)' }}>
            Blush &amp; Hush was founded on a single conviction: that the spaces we inhabit shape who we become.
            Every project begins not with a brief, but with a conversation about how our clients want to feel.
          </p>
          <p className="body-lg mb-5" style={{ color: 'var(--charcoal)' }}>
            We work slowly and deliberately. We take on fewer projects each year than we are offered, because
            attention is the only currency that matters in this work. When we start a project, it occupies every
            surface of our studio.
          </p>
          <p className="body-lg" style={{ color: 'var(--charcoal)' }}>
            Based in Chennai, we work across India and occasionally internationally, wherever the project
            warrants the journey.
          </p>
        </div>
      </section>

      {/* Philosophy strip */}
      <section
        className="py-[100px] px-6 text-center"
        style={{ backgroundColor: 'var(--linen)' }}
      >
        <span className="gold-rule mx-auto block mb-8" />
        <p
          className="font-cormorant italic mx-auto max-w-xl"
          style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 300, color: 'var(--navy)', lineHeight: 1.4 }}
        >
          &ldquo;Space is not a backdrop. It is the experience itself.&rdquo;
        </p>
      </section>

      {/* Team */}
      <section className="py-20 px-6 md:px-10" style={{ backgroundColor: 'var(--ivory)' }}>
        <p className="label mb-10" style={{ color: 'var(--steel)' }}>The People</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col gap-3">
              <div
                className="img-placeholder"
                style={{ aspectRatio: '1', backgroundColor: '#1e2d3e' }}
              >
                <span style={{ color: 'var(--steel)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
                  Photography placeholder: {member.name}
                </span>
              </div>
              <h3
                className="font-cormorant italic"
                style={{ fontSize: '20px', fontWeight: 300, color: 'var(--navy)' }}
              >
                {member.name}
              </h3>
              <p className="label-sm" style={{ color: 'var(--steel)' }}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section
        className="py-20 px-6 md:px-10"
        style={{ backgroundColor: 'var(--navy)' }}
        data-dark
      >
        <p className="label mb-10" style={{ color: 'var(--steel)' }}>Awards &amp; Recognition</p>
        <div className="flex flex-col">
          {awards.map((award, i) => (
            <div
              key={i}
              className="flex items-start gap-8 py-6"
              style={{ borderBottom: i < awards.length - 1 ? '0.5px solid rgba(255,255,255,0.08)' : 'none' }}
            >
              <span className="label flex-shrink-0 w-12" style={{ color: 'var(--gold)' }}>
                {award.year}
              </span>
              <div>
                <h3
                  className="font-cormorant italic"
                  style={{ fontSize: '22px', fontWeight: 300, color: 'var(--ivory)', lineHeight: 1.2 }}
                >
                  {award.title}
                </h3>
                <p className="label-sm mt-1" style={{ color: 'var(--steel)' }}>{award.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
