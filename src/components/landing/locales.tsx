"use client"

import { MapPin, Clock } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useElementScrollAnimation } from "@/hooks/use-element-scroll-animation"

const locales = [
  { 
    id: "matriz", 
    nombre: "Iglesia Matriz Zañartu", 
    esMatriz: true, 
    direccion: "Por confirmar", 
    horarios: ["Martes 20:00", "Jueves 20:00", "Domingo 18:30"],
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800"
  },
  { 
    id: "1", 
    nombre: "Oro Verde", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 18:30"]
  },
  { 
    id: "2", 
    nombre: "El Parrón", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 16:00"],
  },
  { 
    id: "3", 
    nombre: "La Hermosa", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 18:30"]
  },
  { 
    id: "4", 
    nombre: "Malloa Norte", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 16:00"],
  },
  { 
    id: "5", 
    nombre: "Malloa Sur", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 18:30"]
  },
  { 
    id: "6", 
    nombre: "Huape", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 18:30"]
  },
  { 
    id: "7", 
    nombre: "Quinchamalí", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 18:30"]
  },
  { 
    id: "8", 
    nombre: "Confluencia", 
    direccion: "Por confirmar", 
    horarios: ["Miércoles 20:00", "Viernes 20:00", "Domingo 18:30"]
  },
]

export function Locales() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })
  const matriz = locales.find(l => l.esMatriz)
  const otros = locales.filter(l => !l.esMatriz)

  return (
    <section ref={ref} id="locales" className="py-12 lg:py-18 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-20 ${isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'}`}>
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-copper font-medium mb-6">
            Nuestros Locales
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight">
            9 Lugares de
            <span className="italic text-copper"> Encuentro</span>
          </h2>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Una iglesia matriz y 8 locales unidos bajo la misma fe y mision.
          </p>
        </div>

        {/* Iglesia Matriz - Featured */}
        {matriz && (
          <div className={`relative rounded-lg overflow-hidden mb-10 ${isVisible ? 'opacity-100 animate-fade-up delay-100' : 'opacity-0'}`}>
            <div className="aspect-[16/10] sm:aspect-[21/9] relative min-h-[400px] sm:min-h-0">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${matriz.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center sm:items-center p-6 sm:p-8 lg:p-16">
                <div className="max-w-xl w-full">
                  <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm bg-copper text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold text-white mb-4 sm:mb-6">
                    Iglesia Matriz
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-6xl text-white mb-4 sm:mb-6">Zañartu</h3>
                  
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-copper mt-0.5 sm:mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Direccion</p>
                        <p className="text-sm sm:text-base text-white break-words">{matriz.direccion}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-copper mt-0.5 sm:mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Horarios de Culto</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {matriz.horarios.map((h, i) => (
                            <span key={i} className="text-xs sm:text-sm text-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded-sm bg-white/10 border border-white/10 whitespace-nowrap">{h}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Locales Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otros.map((local) => (
            <LocalCard key={local.id} local={local} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LocalCard({ local }: { local: typeof locales[0] }) {
  const [ref, isVisible] = useElementScrollAnimation({ threshold: 0.2, rootMargin: "0px" })
  
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group relative rounded-lg overflow-hidden bg-white border border-gray-200 transition-all duration-700 hover:border-copper/30 hover-lift ${
        isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Image placeholder */}
      <div className="aspect-[16/10] relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-6xl text-gray-200 select-none">{local.nombre.charAt(0)}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-lg text-gray-900 group-hover:text-copper transition-colors duration-500 mb-4">
          {local.nombre}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-copper mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-600">{local.direccion}</span>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-copper mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {local.horarios.map((h, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-sm bg-copper/10 text-copper border border-copper/20">{h}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-copper transform scale-x-0 transition-transform duration-700 origin-left group-hover:scale-x-100" />
    </div>
  )
}
