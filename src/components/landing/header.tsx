"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const navLinks = [
  { href: "#ministerios", label: "GRUPOS" },
  { href: "#locales", label: "LOCALES" },
  { href: "#liderazgo", label: "PASTORES" },
  { href: "#contacto", label: "CONTACTO" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled 
          ? "bg-[#1a1512]/65 backdrop-blur-xl border-b border-white/5" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="#inicio" className="group flex items-center gap-4">
            <div className="h-15 w-auto overflow-hidden relative">
              <Image
                src="/image/logo.png"
                alt="IMPCH Zañartu"
                width={300}
                height={200}
                className="w-auto h-40 object-contain object-bottom transition-opacity duration-300 group-hover:opacity-80"
                style={{ 
                  clipPath: 'inset(50% 0 0 0)',
                  marginTop: '-53%'
                }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[13px] tracking-[0.15em] font-medium text-white/50 hover:text-white transition-all duration-500 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-500" style={{ backgroundColor: '#0e2757' }} />
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <a 
              href="/login"
              className="hidden sm:inline-flex h-11 px-7 items-center justify-center bg-copper text-white text-[12px] tracking-[0.15em] font-semibold rounded-sm transition-all duration-500 hover:bg-[#1e3d6f] hover:shadow-[0_0_30px_rgba(14,39,87,0.3)]"
            >
              Intranet
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden w-11 h-11 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-700 ease-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-6 py-8 bg-[#1a1512]/98 backdrop-blur-xl border-t border-white/5">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="py-5 text-base tracking-[0.2em] font-medium text-white/60 hover:text-copper transition-all duration-500 border-b border-white/5 last:border-0"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-6">
          <a 
              href="/login"
              className="hidden sm:inline-flex h-11 px-7 items-center justify-center bg-copper text-white text-[12px] tracking-[0.15em] font-semibold rounded-sm transition-all duration-500 hover:bg-[#1e3d6f] hover:shadow-[0_0_30px_rgba(14,39,87,0.3)]"
            >
              Intranet
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
