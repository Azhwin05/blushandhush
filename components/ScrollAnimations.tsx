'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    let ctx: any

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // ── Global image reveal ──────────────────────────────
        const images = document.querySelectorAll<HTMLElement>('.img-placeholder, [data-reveal="image"]')
        images.forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.06, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
              },
            }
          )
        })

        // ── Project card staggered reveal ────────────────────
        const projectGrid = document.querySelector('.project-grid')
        if (projectGrid) {
          const cards = projectGrid.querySelectorAll<HTMLElement>('.group')
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: projectGrid,
                start: 'top 78%',
              },
            }
          )
        }

        // ── Stats counter animation ──────────────────────────
        const statNums = document.querySelectorAll<HTMLElement>('[data-count]')
        statNums.forEach((el) => {
          const target = parseInt(el.dataset.count || '0', 10)
          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.floor(obj.val).toString() },
            scrollTrigger: { trigger: el, start: 'top 85%' },
          })
        })

        // ── Philosophy / quote word reveal ───────────────────
        const quotes = document.querySelectorAll<HTMLElement>('[data-word-reveal]')
        quotes.forEach((quote) => {
          const words = quote.querySelectorAll<HTMLElement>('span.word')
          if (words.length === 0) return
          gsap.fromTo(
            words,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0.01 },
            {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: 0.7,
              stagger: 0.04,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: quote,
                start: 'top 80%',
              },
            }
          )
        })

        // ── Gold rule draw animation ─────────────────────────
        const rules = document.querySelectorAll<HTMLElement>('.gold-rule')
        rules.forEach((rule) => {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.8,
              ease: 'power2.out',
              transformOrigin: 'left',
              scrollTrigger: { trigger: rule, start: 'top 90%' },
            }
          )
        })

        // ── Client quote fade in ─────────────────────────────
        const testimonials = document.querySelectorAll<HTMLElement>('blockquote')
        testimonials.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 80%' },
            }
          )
        })
      })
    }

    // Small delay to let DOM settle after route change
    const t = setTimeout(init, 120)

    return () => {
      clearTimeout(t)
      ctx?.revert()
    }
  }, [pathname])

  return null
}
