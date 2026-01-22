"use client"

import { User, MapPin } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useElementScrollAnimation } from "@/hooks/use-element-scroll-animation"

const encargados = [
  { id: 1, local: "Oro Verde", nombre: "Renato Alarcón" },
  { id: 2, local: "El Parrón", nombre: "Rubén Rodríguez" },
  { id: 3, local: "La Hermosa", nombre: "Pedro Rodríguez" },
  { id: 4, local: "Malloa Norte", nombre: "Luis Flores" },
  { id: 5, local: "Malloa Sur", nombre: "Rubén Orellana" },
  { id: 6, local: "Huape", nombre: "Patrick Hidalgo" },
  { id: 7, local: "Quinchamalí", nombre: "Juan Carlos Muñoz" },
  { id: 8, local: "Confluencia", nombre: "Alejandro Ruiz" },
]

export function Encargados() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section ref={ref} id="encargados" className="py-12 lg:py-18 relative bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'}`}>
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-copper font-medium mb-6">
            Encargados de Local
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight">
            Líderes en cada
            <span className="italic text-copper"> Localidad</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {encargados.map((e) => (
            <EncargadoCard key={e.id} encargado={e} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EncargadoCard({ encargado }: { encargado: typeof encargados[0] }) {
  const [ref, isVisible] = useElementScrollAnimation({ threshold: 0.2, rootMargin: "0px" })
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group relative rounded-lg overflow-hidden bg-white border border-gray-200 p-6 transition-all duration-700 hover:border-copper/30 hover-lift ${
        isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-lg bg-copper/10 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-copper/20 group-hover:scale-110">
        <User className="w-6 h-6 text-copper" />
      </div>

      {/* Badge */}
      <span className="inline-block px-3 py-1 rounded-sm bg-copper text-[9px] tracking-wider uppercase font-semibold text-white mb-4">
        Encargado
      </span>

      {/* Name */}
      <p className="font-display text-lg text-gray-900 group-hover:text-copper transition-colors duration-500">Hno. {encargado.nombre}</p>
      
      {/* Local */}
      <div className="flex items-center gap-2 mt-3 text-gray-600">
        <MapPin className="w-3.5 h-3.5 text-copper" />
        <span className="text-sm">{encargado.local}</span>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-copper transform scale-x-0 transition-transform duration-700 origin-left group-hover:scale-x-100" />
    </div>
  )
}
