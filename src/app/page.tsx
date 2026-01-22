import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Ministerios } from "@/components/landing/ministerios"
import { Locales } from "@/components/landing/locales"
import { Liderazgo } from "@/components/landing/liderazgo"
import { Encargados } from "@/components/landing/encargados"
import { AyudantesLocales } from "@/components/landing/ayudantes-locales"
import { CorosUnidos } from "@/components/landing/coros-unidos"
import { Contacto } from "@/components/landing/contacto"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Ministerios />
      <Locales />
      <Liderazgo />
      <Encargados />
      <AyudantesLocales />
      <CorosUnidos />
      {/* <Contacto /> */}
      <Footer />
    </main>
  )
}
