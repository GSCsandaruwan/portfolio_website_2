import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import MouseGlow from './components/MouseGlow'

function App() {
  useEffect(() => {
    // Update title dynamically
    document.title = 'G.S.C. Sandaruwan | IT Undergraduate & Aspiring Software Developer'
  }, [])

  return (
    <div className="bg-[#08090D] min-h-screen relative overflow-x-hidden">
      <MouseGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
