import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

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

// ─── CONFIGURE EMAIL INTEGRATION ───────────────────────────────────────────
// Option 1 — Formspree: https://formspree.io  → replace FORMSPREE_ID below
// Option 2 — EmailJS or Resend: add your credentials here
const FORMSPREE_ENDPOINT = '' // e.g. 'https://formspree.io/f/YOUR_FORM_ID'
// ────────────────────────────────────────────────────────────────────────────

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'champikasandaruwan14@gmail.com',
    href: 'mailto:champikasandaruwan14@gmail.com',
  },
  {
    icon: GithubIcon,
    label: 'GitHub',
    value: 'github.com/champikasandaruwan14-boop',
    href: 'https://github.com/champikasandaruwan14-boop',
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    value: 'linkedin.com/in/champika-sandaruwan',
    href: 'https://www.linkedin.com/in/champika-sandaruwan-2a6971371/',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

function InputField({ label, id, type = 'text', required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
        {label} {required && <span className="text-[#B6FF5C]">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#F5F5F5] text-sm placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#B6FF5C]/40 focus:bg-white/[0.05] transition-all duration-200"
        {...props}
      />
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | no-backend

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters'
    return e
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }

    if (!FORMSPREE_ENDPOINT) {
      setStatus('no-backend')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section-padding bg-[#08090D]">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <span className="section-label">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5] mt-2 max-w-lg">
            Let&apos;s Build Something{' '}
            <span className="text-gradient">Great Together.</span>
          </h2>
          <p className="text-[#A1A1AA] mt-3 max-w-xl text-sm">
            I&apos;m always interested in connecting with developers, recruiters, and people
            working on exciting technology projects. Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={1}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card rounded-xl p-4 border border-white/[0.08] hover:border-[#B6FF5C]/20 group transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[#B6FF5C]/8 border border-[#B6FF5C]/15 flex items-center justify-center group-hover:bg-[#B6FF5C]/15 transition-colors flex-shrink-0">
                  <Icon size={16} className="text-[#B6FF5C]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">{label}</p>
                  <p className="text-[#F5F5F5] text-sm font-medium truncate group-hover:text-[#B6FF5C] transition-colors">
                    {value}
                  </p>
                </div>
              </a>
            ))}

            <div className="glass-card rounded-xl p-5 border border-white/[0.08] mt-6">
              <p className="text-[#A1A1AA] text-xs leading-relaxed">
                Whether you&apos;re looking for an intern, a collaborator, or a freelancer — I&apos;d love to hear from you. I typically respond within 24–48 hours.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={2}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <InputField
                    label="Name"
                    id="name"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <InputField
                    label="Email"
                    id="email"
                    type="email"
                    required
                    placeholder="your.visitor@email.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <InputField
                  label="Subject"
                  id="subject"
                  required
                  placeholder="What is this regarding?"
                  value={form.subject}
                  onChange={handleChange}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && (
                  <p id="subject-error" className="text-xs text-red-400 mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Message <span className="text-[#B6FF5C]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project, opportunity, or anything you'd like to discuss..."
                  value={form.message}
                  onChange={handleChange}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={!!errors.message}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#F5F5F5] text-sm placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#B6FF5C]/40 focus:bg-white/[0.05] transition-all duration-200 resize-none"
                />
                {errors.message && (
                  <p id="message-error" className="text-xs text-red-400">{errors.message}</p>
                )}
              </div>

              {/* Status messages */}
              {status === 'no-backend' && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  <p>
                    Email service not configured yet. To enable this form, add your Formspree endpoint in{' '}
                    <code className="bg-black/30 px-1 rounded">Contact.jsx</code> or contact me directly at{' '}
                    <a href="mailto:champikasandaruwan14@gmail.com" className="underline">champikasandaruwan14@gmail.com</a>.
                  </p>
                </div>
              )}
              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#B6FF5C]/10 border border-[#B6FF5C]/20 text-[#B6FF5C] text-xs">
                  <CheckCircle2 size={15} />
                  Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle size={15} />
                  Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#08090D]/30 border-t-[#08090D] rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
