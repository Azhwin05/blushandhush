'use client'
import { useEffect, useRef, useState } from 'react'

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true)
  const [count, setCount] = useState(0)
  const [curtainUp, setCurtainUp] = useState(false)
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Only fire on first visit in a session
    const alreadySeen = sessionStorage.getItem('bh-loaded')
    if (alreadySeen) {
      setVisible(false)
      onComplete?.()
      return
    }

    // Animate counter 0 → 100 over ~1.5s
    let current = 0
    counterRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 3
      if (current >= 100) {
        current = 100
        clearInterval(counterRef.current!)
        // Start curtain sweep
        setTimeout(() => {
          setCurtainUp(true)
          setTimeout(() => {
            setVisible(false)
            sessionStorage.setItem('bh-loaded', '1')
            onComplete?.()
          }, 600)
        }, 300)
      }
      setCount(current)
    }, 50)

    return () => { if (counterRef.current) clearInterval(counterRef.current) }
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'var(--navy)',
        transition: 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        transform: curtainUp ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      {/* Animated SVG Logo */}
      <svg
        viewBox="0 0 200 60"
        width="160"
        height="48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8"
      >
        {/* B&H wordmark path — drawn via stroke-dashoffset */}
        <text
          x="10"
          y="44"
          fontFamily="Georgia, serif"
          fontSize="38"
          fontStyle="italic"
          fontWeight="300"
          fill="none"
          stroke="#F5F0E8"
          strokeWidth="0.8"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: curtainUp ? 0 : 600,
            transition: 'stroke-dashoffset 1.5s ease',
          }}
        >
          B&amp;H
        </text>
        {/* Sub-label */}
        <text
          x="10"
          y="58"
          fontFamily="Arial, sans-serif"
          fontSize="7"
          letterSpacing="4"
          fill="#F5F0E8"
          style={{
            opacity: count > 60 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          BLUSH &amp; HUSH
        </text>
      </svg>

      {/* Counter */}
      <div
        className="absolute bottom-10 right-10 label"
        style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '0.1em' }}
      >
        {String(count).padStart(2, '0')}
      </div>
    </div>
  )
}
