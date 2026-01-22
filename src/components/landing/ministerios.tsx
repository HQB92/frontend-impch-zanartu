"use client"

import { Heart, Bike, Music, BookOpen, HeartHandshake, Sparkles } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useElementScrollAnimation } from "@/hooks/use-element-scroll-animation"

const ministerios = [
  {
    id: "dorcas",
    nombre: "Dorcas",
    descripcion: "Mujeres dedicadas al servicio, la oracion y el cuidado de la comunidad.",
    icon: Heart,
  },
  {
    id: "jovenes",
    nombre: "Jovenes",
    descripcion: "El presente y futuro de la iglesia, llenos de pasion y energia.",
    icon: Sparkles,
  },
  {
    id: "ciclistas",
    nombre: "Ciclistas",
    descripcion: "Fe y unidad en el camino del Señor.",
    icon: Bike,
  },
  {
    id: "coro",
    nombre: "Coro Oficial",
    descripcion: "Elevamos nuestras voces en alabanza y adoracion al Senor por cada local.",
    icon: Music,
  },
  {
    id: "escuela",
    nombre: "Escuela Dominical",
    descripcion: "Formando a las nuevas generaciones en la Palabra de Dios.",
    icon: BookOpen,
  },
  {
    id: "Coros Unidos",
    nombre: "Coros Unidos",
    descripcion: "Uniendo nuestras voces en alabanza y adoracion al Senor.",
    icon: Music,
  },
]

export function Ministerios() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section ref={ref} id="ministerios" className="py-12 lg:py-18 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 lg:px-6">
        {/* Header */}
        <div className={`text-center mb-20 ${isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'}`}>
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-copper font-medium mb-6">
            Nuestros Grupos
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight">
            Sirviendo con
            <span className="italic text-copper"> Pasion</span>
          </h2>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Cada grupo es una expresion del amor de Cristo. 
            Encuentra tu lugar y sirve junto a nosotros.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ministerios.map((m, i) => {
            const Icon = m.icon
            return (
              <MinisterioCard key={m.id} ministerio={m} Icon={Icon} />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MinisterioCard({ ministerio, Icon }: { ministerio: typeof ministerios[0], Icon: any }) {
  const [ref, isVisible] = useElementScrollAnimation({ threshold: 0.2, rootMargin: "0px" })
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group relative overflow-hidden rounded-lg bg-white border border-gray-200 p-8 cursor-pointer transition-all duration-700 hover:border-copper/30 hover:bg-gray-50 hover-lift ${
        isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-lg bg-copper/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-copper/20 group-hover:scale-110">
        <Icon className="w-6 h-6 text-copper transition-transform duration-500 group-hover:scale-110" />
      </div>
      
      {/* Content */}
      <h3 className="font-display text-xl text-gray-900 mb-3 tracking-wide group-hover:text-copper transition-colors duration-500">
        {ministerio.nombre}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-500">
        {ministerio.descripcion}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-copper transform scale-x-0 transition-transform duration-700 origin-left group-hover:scale-x-100" />
      
      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}
