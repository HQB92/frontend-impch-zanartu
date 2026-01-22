"use client"

import { Users, MapPin } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useElementScrollAnimation } from "@/hooks/use-element-scroll-animation"

const ayudantesPorLocal = [
  { 
    id: 1, 
    local: "Oro Verde", 
    ayudantes: [
      { nombre: "Carlos Muñoz", cargo: "Ayudante" },
      { nombre: "Héctor Zapata", cargo: "Ayudante" }
    ]
  },
  { 
    id: 2, 
    local: "El Parrón", 
    ayudantes: [
      { nombre: "Gerardo Alarcón", cargo: "Ayudante" },
      { nombre: "César Martínez", cargo: "Colaborador" }
    ]
  },
  { 
    id: 3, 
    local: "La Hermosa", 
    ayudantes: [
      { nombre: "Esteban Torres", cargo: "Ayudante" },
      { nombre: "Arcadio Rivas", cargo: "Ayudante" }
    ]
  },
  { 
    id: 4, 
    local: "Malloa Norte", 
    ayudantes: [
      { nombre: "Luis Rojas", cargo: "Ayudante" },
      { nombre: "José Retamal", cargo: "Ayudante" }
    ]
  },
  { 
    id: 5, 
    local: "Malloa Sur", 
    ayudantes: [
      { nombre: "Pablo Durán", cargo: "Ayudante" },
      { nombre: "Juan Carlos Pinto", cargo: "Ayudante" }
    ]
  },
  { 
    id: 6, 
    local: "Huape", 
    ayudantes: [
      { nombre: "Herman Rodríguez", cargo: "Ayudante" },
      { nombre: "Daniel Caro", cargo: "Ayudante" }
    ]
  },
  { 
    id: 7, 
    local: "Quinchamalí", 
    ayudantes: [
      { nombre: "Wilson Ruiz", cargo: "Ayudante" },
      { nombre: "José Hernández", cargo: "Ayudante" }
    ]
  },
  { 
    id: 8, 
    local: "Confluencia", 
    ayudantes: [
      { nombre: "Demetrio Cabezas", cargo: "Ayudante" },
      { nombre: "Salvador Gómez", cargo: "Ayudante" }
    ]
  },
]

export function AyudantesLocales() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section ref={ref} id="ayudantes-locales" className="py-12 lg:py-18 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'}`}>
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-copper font-medium mb-6">
            Ayudantes de Encargado
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight">
            Sirviendo
            <span className="italic text-copper"> Juntos</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ayudantesPorLocal.map((local) => (
            <AyudantesCard key={local.id} local={local} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AyudantesCard({ local }: { local: typeof ayudantesPorLocal[0] }) {
  const [ref, isVisible] = useElementScrollAnimation({ threshold: 0.2, rootMargin: "0px" })
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group relative rounded-lg overflow-hidden bg-white border border-gray-200 transition-all duration-700 hover:border-copper/30 hover-lift ${
        isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="p-6">
        {/* Local header */}
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-copper/10 flex items-center justify-center transition-all duration-500 group-hover:bg-copper/20">
            <MapPin className="w-4 h-4 text-copper" />
          </div>
          <span className="font-display text-lg text-gray-900 group-hover:text-copper transition-colors duration-500">{local.local}</span>
        </div>

        {/* Ayudantes list */}
        <div className="space-y-3">
          {local.ayudantes.map((a, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-copper/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-copper/60" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Hno. {a.nombre}</p>
                <p className={`text-[10px] tracking-wider uppercase ${a.cargo === 'Colaborador' ? 'text-copper/60' : 'text-gray-500'}`}>{a.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-copper transform scale-x-0 transition-transform duration-700 origin-left group-hover:scale-x-100" />
    </div>
  )
}
