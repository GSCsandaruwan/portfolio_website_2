import { Mail, ArrowUp } from 'lucide-react'

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function LinkedinIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/champikasandaruwan14-boop' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/champika-sandaruwan-2a6971371/' },
  { icon: Mail, label: 'Email', href: 'mailto:champikasandaruwan14@gmail.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollTo = (href) => {
    const el = document.getElementById(href.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-[#101219] border-t border-white/[0.06] relative overflow-hidden">
      <div className="container-custom py-12 relative z-10">
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 group cursor-pointer" onClick={() => scrollTo('#home')}>
              <div className="w-8 h-8 rounded-lg bg-[#B6FF5C] flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(182,255,92,0.4)] transition-all duration-300">
                <span className="text-[#08090D] font-bold text-sm font-['Space_Grotesk']">CS</span>
              </div>
              <span className="text-[#F5F5F5] font-semibold text-sm tracking-wide">
                G.S.C.<span className="text-[#B6FF5C] ml-1">Sandaruwan</span>
              </span>
            </div>
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-5 max-w-xs">
              IT Undergraduate passionate about building intelligent solutions through code.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-[#A1A1AA] hover:text-[#B6FF5C] hover:border-[#B6FF5C]/30 hover:bg-[#B6FF5C]/8 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(182,255,92,0.15)] transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F5F5F5] font-semibold text-xs mb-4 uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[#A1A1AA] text-sm hover:text-[#B6FF5C] transition-colors text-left cursor-pointer flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#B6FF5C] group-hover:scale-150 transition-all" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#F5F5F5] font-semibold text-xs mb-4 uppercase tracking-widest">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:champikasandaruwan14@gmail.com"
                  className="text-[#A1A1AA] text-sm hover:text-[#B6FF5C] transition-colors break-all"
                >
                  champikasandaruwan14@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/champikasandaruwan14-boop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A1A1AA] text-sm hover:text-[#B6FF5C] transition-colors flex items-center gap-2 group"
                >
                  <span>GitHub Profile</span>
                  <span className="text-[#B6FF5C] text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/champika-sandaruwan-2a6971371/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A1A1AA] text-sm hover:text-[#B6FF5C] transition-colors flex items-center gap-2 group"
                >
                  <span>LinkedIn Profile</span>
                  <span className="text-[#B6FF5C] text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-[#A1A1AA] text-xs">
              © {year} G.S.C. Sandaruwan. All rights reserved.
            </p>
            <p className="text-[#A1A1AA]/60 text-xs mt-0.5">
              Designed &amp; Built with <span className="text-[#B6FF5C]">passion</span>.
            </p>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollTop}
            aria-label="Back to top"
            className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-[#A1A1AA] hover:text-[#08090D] hover:bg-[#B6FF5C] hover:border-[#B6FF5C] hover:shadow-[0_0_15px_rgba(182,255,92,0.3)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
          >
            <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}
