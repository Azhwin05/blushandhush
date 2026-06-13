export default function MarqueeStrip() {
  const text = 'Interior Architecture · Bespoke Furniture · Material Sourcing · Chennai · UAE · Since 2018 ·'

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: 'var(--navy)', height: '56px' }}
    >
      <div className="marquee-track h-full flex items-center">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="font-cormorant italic whitespace-nowrap pr-16"
            style={{ color: 'var(--gold)', fontSize: '18px', lineHeight: 1 }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
