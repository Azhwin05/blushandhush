'use client'
import { useEffect, useRef } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#@%&'

class Scrambler {
  el: HTMLElement
  chars: string
  frameRequest: number = 0
  frame: number = 0
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = []
  resolve: () => void = () => {}

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = CHARS
    this.update = this.update.bind(this)
  }

  setText(newText: string): Promise<void> {
    const old = this.el.innerText
    const len = Math.max(old.length, newText.length)
    return new Promise((resolve) => {
      this.resolve = resolve
      this.queue = []
      for (let i = 0; i < len; i++) {
        const from = old[i] || ''
        const to = newText[i] || ''
        const start = Math.floor(Math.random() * 10)
        const end = start + Math.floor(Math.random() * 15)
        this.queue.push({ from, to, start, end })
      }
      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
    })
  }

  update() {
    let output = ''
    let complete = 0
    for (const item of this.queue) {
      const { to, start, end } = item
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)]
        }
        output += `<span style="opacity:0.4;color:#C8A96A">${item.char}</span>`
      } else {
        output += item.from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

interface TextScrambleProps {
  text: string
  className?: string
  style?: React.CSSProperties
  trigger?: boolean
}

export default function TextScramble({ text, className, style, trigger = true }: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const scramblerRef = useRef<Scrambler | null>(null)

  useEffect(() => {
    if (!ref.current) return
    scramblerRef.current = new Scrambler(ref.current)
  }, [])

  useEffect(() => {
    if (trigger && scramblerRef.current) {
      ref.current!.innerText = text
        .split('')
        .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
        .join('')
      scramblerRef.current.setText(text)
    }
  }, [trigger, text])

  return (
    <span ref={ref} className={className} style={style}>
      {text}
    </span>
  )
}
