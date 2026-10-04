import Hero from './components/Hero'
import { About, Gallery, Guarantees, Perks, Reviews, ServiceArea, Services, Specials } from './components/Sections'
import { Contact, Footer } from './components/Contact'

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Perks />
        <Services />
        <About />
        <Gallery />
        <Specials />
        <Guarantees />
        <Reviews />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
