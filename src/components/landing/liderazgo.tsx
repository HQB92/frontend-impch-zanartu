"use client"

import { User } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useElementScrollAnimation } from "@/hooks/use-element-scroll-animation"

const pastores = [
  { id: "pastor", nombre: "Hugo Villena Villena", rol: "Pastor" },
  { id: "pastora", nombre: "Irma Baeza Navarrete", rol: "Pastora" },
]

const oficiales = [
  { id: 1, cargo: "Ayudante", nombre: "Víctor Patricio", apellidos: "Villena Baeza" },
  { id: 2, cargo: "Secretario", nombre: "Hugo Esteban", apellidos: "Quinteros Bustos" },
  { id: 3, cargo: "Oficial", nombre: "Germain Moisés", apellidos: "Chávez Muñoz" },
  { id: 4, cargo: "Oficial", nombre: "Alejandro Alberto", apellidos: "Ruiz Venega" },
  { id: 5, cargo: "Oficial", nombre: "Luis Isidoro", apellidos: "Orellana Muñoz" },
  { id: 6, cargo: "Oficial", nombre: "Luis Isaac", apellidos: "Flores Carrasco" },
  { id: 7, cargo: "Oficial", nombre: "Luciano Naamán", apellidos: "Orellana Muñoz" },
  { id: 8, cargo: "Oficial", nombre: "Alejandro Mauricio", apellidos: "Vásquez Vilches" },
  { id: 9, cargo: "Oficial", nombre: "Antonio Alejandro", apellidos: "Castro Parra" },
  { id: 10, cargo: "Oficial", nombre: "Moisés", apellidos: "Escares Rabanal" },
  { id: 11, cargo: "Oficial", nombre: "Pedro", apellidos: "Rodríguez" },
  { id: 12, cargo: "Oficial", nombre: "Jacob Esteban", apellidos: "Villagra Fuentes" },
  { id: 13, cargo: "Oficial", nombre: "Gerardo Octavio", apellidos: "Alarcón Alarcón" },
]

export function Liderazgo() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section ref={ref} id="liderazgo" className="py-12 lg:py-18 relative bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-20 ${isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'}`}>
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-copper font-medium mb-6">
            Nuestro Liderazgo
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight">
            Siervos de Dios
            <span className="italic text-copper"> al Frente</span>
          </h2>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Conoce a quienes guían y sirven a nuestra congregación con dedicación y amor.
          </p>
        </div>

        {/* Pastores */}
        <div className="mb-20">
          <p className={`text-[11px] tracking-[0.3em] uppercase text-gray-500 font-medium mb-8 text-center ${
            isVisible ? 'opacity-100 animate-fade-up delay-100' : 'opacity-0'
          }`}>Pastores</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pastores.map((p) => (
              <PastorCard key={p.id} pastor={p} />
            ))}
          </div>
        </div>

        {/* Oficiales */}
        <div>
          <div className={`flex items-center justify-center gap-4 mb-10 ${
            isVisible ? 'opacity-100 animate-fade-up delay-200' : 'opacity-0'
          }`}>
            <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-gray-300" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-gray-500 font-medium">Cuerpo de Oficiales</p>
            <span className="text-xs px-3 py-1 rounded-sm bg-copper text-white font-bold">{oficiales.length}</span>
            <div className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {oficiales.map((o) => (
              <OficialCard key={o.id} oficial={o} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PastorCard({ pastor }: { pastor: typeof pastores[0] }) {
  const [ref, isVisible] = useElementScrollAnimation({ threshold: 0.2, rootMargin: "0px" })
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group relative rounded-lg overflow-hidden bg-white border border-gray-200 p-10 text-center transition-all duration-700 hover:border-copper/30 hover-lift ${
        isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Avatar */}
      <div className="w-24 h-24 mx-auto rounded-full bg-copper/20 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-copper/30 group-hover:scale-105">
        <span className="font-display text-3xl text-copper">{pastor.nombre.split(' ')[0][0]}{pastor.nombre.split(' ')[1]?.[0]}</span>
      </div>
      
      <span className="inline-block px-4 py-1.5 rounded-sm bg-copper text-[10px] tracking-[0.2em] uppercase font-semibold text-white mb-6">
        {pastor.rol}
      </span>
      
      <p className="font-display text-2xl text-gray-900">{pastor.nombre}</p>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-copper transform scale-x-0 transition-transform duration-700 origin-center group-hover:scale-x-100" />
    </div>
  )
}

function OficialCard({ oficial }: { oficial: typeof oficiales[0] }) {
  const [ref, isVisible] = useElementScrollAnimation({ threshold: 0.2, rootMargin: "0px" })
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group relative rounded-lg overflow-hidden bg-white border border-gray-200 p-6 transition-all duration-700 hover:border-copper/30 hover-lift ${
        isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-all duration-500 ${
        oficial.cargo === 'Ayudante' || oficial.cargo === 'Secretario'
          ? 'bg-copper group-hover:bg-[#1e3d6f]' 
          : 'bg-copper/10 group-hover:bg-copper/20'
      }`}>
        <User className={`w-5 h-5 transition-colors duration-300 ${
          oficial.cargo === 'Ayudante' || oficial.cargo === 'Secretario'
            ? 'text-white'
            : 'text-copper'
        }`} />
      </div>

      {/* Badge */}
      <span className={`inline-block px-2.5 py-1 rounded-sm text-[9px] tracking-wider uppercase font-semibold mb-4 ${
        oficial.cargo === 'Ayudante' || oficial.cargo === 'Secretario'
          ? 'bg-copper text-white' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {oficial.cargo}
      </span>

      {/* Name */}
      <p className="font-medium text-gray-900 text-sm leading-tight group-hover:text-copper transition-colors duration-500">{oficial.nombre}</p>
      <p className="text-xs text-gray-600 mt-1">{oficial.apellidos}</p>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-copper transform scale-x-0 transition-transform duration-700 origin-left group-hover:scale-x-100" />
    </div>
  )
}