"use client"

import { Music, Crown } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useElementScrollAnimation } from "@/hooks/use-element-scroll-animation"

const jefes = [
  { id: 1, nombre: "Héctor Zapata" },
  { id: 2, nombre: "Antonio Castro" }
]

export function CorosUnidos() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section ref={ref} id="coros-unidos" className="py-12 lg:py-18 relative bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'}`}>
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-copper font-medium mb-6">
            Cuerpo Musical
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight">
            Coros
            <span className="italic text-copper"> Unidos</span>
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
            Alabando a una sola voz. El cuerpo de coros unidos representa la unidad musical de nuestra iglesia.
          </p>
        </div>

        {/* Main card */}
        <div className={`max-w-2xl mx-auto ${isVisible ? 'opacity-100 animate-fade-up delay-100' : 'opacity-0'}`}>
          <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200">
            <div className="p-10 lg:p-14">
              {/* Icon header */}

              <p className="text-[11px] tracking-[0.3em] uppercase text-gray-500 font-medium text-center mb-8">
                Jefes de Coros
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jefes.map((jefe) => (
                  <JefeCard key={jefe.id} jefe={jefe} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function JefeCard({ jefe }: { jefe: typeof jefes[0] }) {
  const [ref, isVisible] = useElementScrollAnimation({ threshold: 0.2, rootMargin: "0px" })
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200 transition-all duration-700 hover:border-copper/30 hover-lift ${
        isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-copper/20 flex items-center justify-center transition-all duration-500 group-hover:bg-copper/30 group-hover:scale-110">
          <Crown className="w-6 h-6 text-copper" />
        </div>
        <div>
          <span className="inline-block px-2.5 py-1 rounded-sm bg-copper text-[9px] tracking-wider uppercase font-semibold text-white mb-2">
            Jefe
          </span>
          <p className="font-display text-lg text-gray-900 group-hover:text-copper transition-colors duration-500">Hno. {jefe.nombre}</p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-copper transform scale-x-0 transition-transform duration-700 origin-left group-hover:scale-x-100" />
    </div>
  )
}

