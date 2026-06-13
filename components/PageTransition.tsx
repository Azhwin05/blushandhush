'use client'
import { createContext, useContext, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TransitionContextType {
  navigate: (href: string) => void
}

const TransitionContext = createContext<TransitionContextType>({ navigate: () => {} })

export function useTransition() {
  return useContext(TransitionContext)
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const navigate = useCallback(
    (href: string) => {
      if (isTransitioning) return
      const curtain = curtainRef.current
      if (!curtain) { router.push(href); return }

      setIsTransitioning(true)

      // Slide curtain up from bottom to cover page
      curtain.style.transition = 'none'
      curtain.style.transform = 'translateY(100%)'

      requestAnimationFrame(() => {
        curtain.style.transition = 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)'
        curtain.style.transform = 'translateY(0%)'

        setTimeout(() => {
          router.push(href)
          // Slide curtain out upward
          setTimeout(() => {
            curtain.style.transform = 'translateY(-100%)'
            setTimeout(() => {
              curtain.style.transition = 'none'
              curtain.style.transform = 'translateY(100%)'
              setIsTransitioning(false)
            }, 500)
          }, 100)
        }, 500)
      })
    },
    [router, isTransitioning]
  )

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9997] pointer-events-none"
        style={{
          backgroundColor: 'var(--ivory)',
          transform: 'translateY(100%)',
        }}
      />
    </TransitionContext.Provider>
  )
}
