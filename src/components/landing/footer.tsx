"use client"

import { ArrowUp } from "lucide-react"
import Image from "next/image"

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#Grupos", label: "Ministerios" },
  { href: "#locales", label: "Locales" },
  { href: "#liderazgo", label: "Liderazgo" },
  { href: "#contacto", label: "Contacto" },
]

export function Footer() {
  return (
    <footer className="relative bg-[#0a0908] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Logo and description */}
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/image/logo.png"
                alt="IMP Zañartu"
                width={500}
                height={500}
                className="h-60 w-auto object-contain"
              />
            </div>

          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-10 gap-y-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-white/40 hover:text-copper transition-colors duration-500 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-copper group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-white/5">
          <p className="text-sm text-white/30">
            {new Date().getFullYear()} IMPCH - Zañartu. Todos los derechos reservados.
          </p>
          
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group w-12 h-12 rounded-sm border border-white/10 flex items-center justify-center hover:bg-copper hover:border-copper transition-all duration-500"
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-500" />
          </button>
        </div>
      </div>
    </footer>
  )
}
