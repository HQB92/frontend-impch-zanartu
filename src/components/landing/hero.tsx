"use client"

import { useEffect, useState, useRef } from "react"
import { Play, ChevronDown } from "lucide-react"
import Link from "next/link"

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 2000
          const step = value / (duration / 16)
          const animate = () => {
            start += step
            if (start >= value) {
              setCount(value)
            } else {
              setCount(Math.floor(start))
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{count}{suffix}</span>
}

export function Hero() {
  const [visible, setVisible] = useState(false)
  useEffect(() => setVisible(true), [])

  const stats = [
    { value: 9, label: "Locales", suffix: "" },
    { value: 6, label: "Grupos", suffix: "" },
    { value: 13, label: "Oficiales", suffix: "" },
    { value: 400, label: "Miembros", suffix: "+" },
  ]

  return (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="absolute inset-0 bg-[#1a1512]/40" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32 lg:py-40 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className={`opacity-0 ${visible ? 'animate-fade-up' : ''}`}>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 mb-10">
              <span className="text-[11px] tracking-[0.25em] uppercase text-white/70 font-medium">
                Iglesia Metodista Pentecostal
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className={`opacity-0 ${visible ? 'animate-fade-up delay-100' : ''}`}>
            <span className="block font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight text-white font-normal">
              Bienvenidos a
            </span>
            <span className="block font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight font-normal italic mt-2" style={{ color: '#0e2757' }}>
              Zañartu
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`mt-8 text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed opacity-0 ${visible ? 'animate-fade-up delay-200' : ''}`}>
            Una comunidad de fe, amor y esperanza. Te invitamos a ser parte 
            de nuestra familia y crecer juntos en el camino de Dios.
          </p>
        </div>

        {/* Stats */}
        <div className={`mt-24 lg:mt-32 opacity-0 ${visible ? 'animate-fade-up delay-500' : ''}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-white/50 mt-2 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 ${visible ? 'animate-fade-in delay-700' : ''}`}>
        <a 
          href="#Grupos" 
          className="flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        >
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full animate-bounce-soft" style={{ backgroundColor: '#0e2757' }} />
          </div>
        </a>
      </div>
    </section>
  )
}
