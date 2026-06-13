'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Disable on touch devices
    if ('ontouchstart' in window) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.body.style.cursor = 'none'

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let raf: number
    let isHovering = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      const cursorType = el.dataset.cursor || 'view'
      const isOnDark = el.closest('[data-dark]') !== null

      isHovering = true
      ring.style.width = '56px'
      ring.style.height = '56px'
      ring.style.borderColor = isOnDark ? 'var(--ivory)' : 'var(--navy)'
      ring.style.backgroundColor = 'transparent'
      dot.style.opacity = '0'

      const labelMap: Record<string, string> = {
        view: 'View',
        shop: 'Shop',
        enquire: 'Enquire',
        drag: 'Drag',
      }
      label.textContent = labelMap[cursorType] || ''
      label.style.opacity = '1'
    }

    const onLeave = () => {
      isHovering = false
      ring.style.width = '8px'
      ring.style.height = '8px'
      ring.style.borderColor = 'transparent'
      ring.style.backgroundColor = 'var(--navy)'
      dot.style.opacity = '1'
      label.style.opacity = '0'
    }

    // Animate ring with lag
    const tick = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      // dot follows cursor exactly
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      ring.style.transform = `translate(${ringX - (isHovering ? 28 : 4)}px, ${ringY - (isHovering ? 28 : 4)}px)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove)

    // Attach hover listeners to interactive elements
    const attach = () => {
      const els = document.querySelectorAll<HTMLElement>('a, button, [data-cursor]')
      els.forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    attach()

    // Re-attach on DOM mutations
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--navy)',
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none flex items-center justify-center"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          border: '0.5px solid transparent',
          backgroundColor: 'var(--navy)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.2s ease, background-color 0.2s ease',
          willChange: 'transform',
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '8px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--navy)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        />
      </div>
    </>
  )
}
