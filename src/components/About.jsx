import { motion } from 'framer-motion'
import { GraduationCap, Cpu, Rocket } from 'lucide-react'

const interests = [
  'Software Engineering',
  'Artificial Intelligence',
  'Computer Vision',
  'Web Development',
  'Problem Solving',
  'Emerging Technologies',
]

const infoCards = [
  {
    num: '01',
    icon: GraduationCap,
    label: 'Education',
    value: 'IT Undergraduate',
    sub: 'University of Ruhuna',
  },
  {
    num: '02',
    icon: Cpu,
    label: 'Main Interest',
    value: 'AI & Software Development',
    sub: 'Computer Vision & Web',
  },
  {
    num: '03',
    icon: Rocket,
    label: 'Career Goal',
    value: 'Real-World Tech Solutions',
    sub: 'Building impactful products',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const tagVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.3 + i * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function About() {
  return (
    <section id="about" className="section-padding bg-[#101219] relative overflow-hidden">
      {/* Background subtle ambient glow */}
      <div
        className="absolute top-1/2 left-0 w-96 h-96 rounded-full pointer-events-none -translate-y-1/2 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <span className="section-label">Who I Am</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5] mt-2">
            About Me
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left — Text */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={1}
              className="space-y-4 text-[#A1A1AA] leading-relaxed text-base mb-8"
            >
              <p>
                I&apos;m an Information Technology undergraduate at the{' '}
                <span className="text-[#F5F5F5] font-semibold">
                  University of Ruhuna
                </span>
                . I&apos;m passionate about building practical software solutions that solve
                real-world problems with elegance and efficiency.
              </p>
              <p>
                My academic journey has deepened my interest in{' '}
                <span className="text-[#B6FF5C] font-semibold">
                  Artificial Intelligence and Computer Vision
                </span>
                , where I enjoy exploring how machines can perceive, interpret, and act upon visual
                data. I work with modern tools like Python, YOLOv8, and OpenCV to engineer
                intelligent systems.
              </p>
              <p>
                Beyond AI, I enjoy frontend development and designing clean, user-centric
                interfaces. I believe great software is both functionally reliable and visually
                inspiring — a philosophy that guides every line of code I craft.
              </p>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={2}
            >
              <p className="text-xs uppercase tracking-widest font-semibold text-[#A1A1AA] mb-4">
                Areas of Interest
              </p>
              <div className="flex flex-wrap gap-2.5">
                {interests.map((interest, i) => (
                  <motion.span
                    key={interest}
                    variants={tagVariants}
                    custom={i}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/[0.08] bg-white/[0.03] text-[#A1A1AA] hover:border-[#B6FF5C]/40 hover:text-[#B6FF5C] hover:bg-[#B6FF5C]/10 hover:shadow-[0_0_12px_rgba(182,255,92,0.15)] transition-colors duration-200 cursor-default"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Info Cards */}
          <div className="space-y-4">
            {infoCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  custom={i + 2}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card rounded-2xl p-5 border border-white/[0.08] flex items-center gap-4 hover:border-[#B6FF5C]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(182,255,92,0.1)] transition-all duration-300 group cursor-default"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#B6FF5C]/8 border border-[#B6FF5C]/15 flex items-center justify-center group-hover:bg-[#B6FF5C]/20 group-hover:border-[#B6FF5C]/40 group-hover:scale-105 transition-all duration-300">
                    <Icon size={20} className="text-[#B6FF5C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#B6FF5C] text-xs font-bold tracking-wider">{card.num}</span>
                      <span className="text-[#A1A1AA] text-xs font-medium uppercase tracking-wider">{card.label}</span>
                    </div>
                    <p className="text-[#F5F5F5] font-semibold text-base truncate group-hover:text-white transition-colors">
                      {card.value}
                    </p>
                    <p className="text-[#A1A1AA] text-xs mt-0.5">{card.sub}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
