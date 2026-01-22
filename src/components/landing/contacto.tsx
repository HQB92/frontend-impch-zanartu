"use client"

import React from "react"
import { useState } from "react"
import { MapPin, Clock, CheckCircle, Send } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function Contacto() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section ref={ref} id="contacto" className="py-12 lg:py-18 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column */}
          <div className={`${isVisible ? 'opacity-100 animate-fade-up' : 'opacity-0'}`}>
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-copper font-medium mb-6">
              Contacto
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight">
              Te
              <span className="italic text-copper"> Esperamos</span>
            </h2>
            <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-md">
              Si tienes preguntas, necesitas oracion o quieres visitarnos, estamos para ti.
            </p>

            <div className="mt-12 space-y-6">
              <div className="group flex items-start gap-4 p-5 rounded-lg bg-white border border-gray-200 transition-all duration-500 hover:border-copper/30">
                <div className="w-12 h-12 rounded-lg bg-copper/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-copper/20">
                  <MapPin className="w-5 h-5 text-copper" />
                </div>
                <div>
                  <p className="font-display text-lg text-gray-900">Ubicacion</p>
                  <p className="text-sm text-gray-600 mt-1">Zañartu, Region del Biobío, Chile</p>
                </div>
              </div>
              
              <div className="group flex items-start gap-4 p-5 rounded-lg bg-white border border-gray-200 transition-all duration-500 hover:border-copper/30">
                <div className="w-12 h-12 rounded-lg bg-copper/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-copper/20">
                  <Clock className="w-5 h-5 text-copper" />
                </div>
                <div>
                  <p className="font-display text-lg text-gray-900">Horarios Matriz</p>
                  <p className="text-sm text-gray-600 mt-1">Martes y Jueves 20:00 | Domingo 18:30</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className={`${isVisible ? 'opacity-100 animate-fade-up delay-100' : 'opacity-0'}`}>
            <div className="rounded-lg overflow-hidden bg-white border border-gray-200">
              <div className="p-8 lg:p-10">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-display text-2xl text-gray-900 mb-2">Mensaje enviado</h3>
                    <p className="text-gray-600 mb-8">Gracias por escribirnos. Te responderemos pronto.</p>
                    <button 
                      type="button"
                      onClick={() => setSubmitted(false)} 
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-all duration-500"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nombre" className="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-3 block">Nombre</label>
                        <input 
                          id="nombre" 
                          type="text"
                          placeholder="Tu nombre" 
                          required 
                          className="w-full h-12 px-4 rounded-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-copper/50 focus:bg-white transition-all duration-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-3 block">Email</label>
                        <input 
                          id="email" 
                          type="email" 
                          placeholder="tu@email.com" 
                          required 
                          className="w-full h-12 px-4 rounded-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-copper/50 focus:bg-white transition-all duration-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="asunto" className="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-3 block">Asunto</label>
                      <input 
                        id="asunto" 
                        type="text"
                        placeholder="Como podemos ayudarte?" 
                        required 
                        className="w-full h-12 px-4 rounded-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-copper/50 focus:bg-white transition-all duration-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="mensaje" className="text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-3 block">Mensaje</label>
                      <textarea 
                        id="mensaje" 
                        placeholder="Escribe tu mensaje..." 
                        rows={4} 
                        required 
                        className="w-full px-4 py-3 rounded-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-copper/50 focus:bg-white transition-all duration-500 resize-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 rounded-sm bg-primary text-primary-foreground font-semibold tracking-wide flex items-center justify-center gap-3 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] disabled:opacity-50 transition-all duration-500"
                    >
                      {loading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar mensaje
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
