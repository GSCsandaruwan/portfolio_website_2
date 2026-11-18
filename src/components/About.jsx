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
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function About() {
  return (
    <section id="about" className="section-padding bg-[#101219]">
      <div className="container-custom">
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
                <span className="text-[#F5F5F5] font-medium">
                  University of Ruhuna
                </span>
                . I&apos;m passionate about building practical software solutions that solve
                real-world problems.
              </p>
              <p>
                My academic journey has deepened my interest in{' '}
                <span className="text-[#B6FF5C] font-medium">
                  Artificial Intelligence and Computer Vision
                </span>
                , where I enjoy exploring how machines can perceive and interpret the visual
                world. I work with modern tools like Python, YOLOv8, and OpenCV to bring
                intelligent systems to life.
              </p>
              <p>
                Beyond AI, I enjoy frontend development and designing clean, user-centric
                interfaces. I believe great software is both functional and beautiful — and
                that mindset shapes everything I build.
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
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/[0.08] bg-white/[0.03] text-[#A1A1AA] hover:border-[#B6FF5C]/30 hover:text-[#B6FF5C] hover:bg-[#B6FF5C]/5 transition-all duration-200 cursor-default"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Cards + Photo */}
          <div className="space-y-5">
            {/* Profile image placeholder */}


            {/* Info Cards */}
            {infoCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  custom={i + 2}
                  className="glass-card rounded-xl p-5 border border-white/[0.08] flex items-center gap-4 hover:border-[#B6FF5C]/20 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#B6FF5C]/8 border border-[#B6FF5C]/15 flex items-center justify-center group-hover:bg-[#B6FF5C]/15 transition-colors">
                    <Icon size={18} className="text-[#B6FF5C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[#B6FF5C] text-xs font-bold">{card.num}</span>
                      <span className="text-[#A1A1AA] text-xs">{card.label}</span>
                    </div>
                    <p className="text-[#F5F5F5] font-semibold text-sm truncate">{card.value}</p>
                    <p className="text-[#A1A1AA] text-xs">{card.sub}</p>
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
