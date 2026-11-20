import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)

    const sections = navLinks.map((l) => l.href.slice(1))
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i])
      if (el && window.scrollY >= el.offsetTop - 140) {
        setActiveSection(sections[i])
        break
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    const el = document.getElementById(href.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08090D]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/30'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-custom flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#home')
            }}
            className="flex items-center gap-2.5 group"
            aria-label="Homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-[#B6FF5C] flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(182,255,92,0.4)] transition-all duration-300">
              <span className="text-[#08090D] font-bold text-sm font-['Space_Grotesk']">CS</span>
            </div>
            <span className="text-[#F5F5F5] font-semibold text-sm hidden sm:block tracking-wide group-hover:text-[#F5F5F5] transition-colors">
              G.S.C.<span className="text-[#B6FF5C] ml-1">Sandaruwan</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.02] p-1 rounded-full border border-white/[0.05] backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.href)
                  }}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-[#08090D]'
                      : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#B6FF5C] rounded-full -z-10 shadow-[0_0_15px_rgba(182,255,92,0.3)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/resume.pdf"
              download
              className="btn-secondary text-xs py-2 px-4 group hover:border-[#B6FF5C]/40 hover:shadow-[0_0_15px_rgba(182,255,92,0.15)]"
              aria-label="Download resume"
            >
              <Download size={13} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Resume</span>
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#08090D]/96 backdrop-blur-2xl flex flex-col pt-20 px-6"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.slice(1)
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }}
                    className={`py-3 px-4 text-base font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'text-[#08090D] bg-[#B6FF5C] font-bold shadow-[0_0_15px_rgba(182,255,92,0.25)]'
                        : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                )
              })}
              <motion.a
                href="/resume.pdf"
                download
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.04 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="btn-primary mt-4 justify-center"
              >
                <Download size={16} />
                Download Resume
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
