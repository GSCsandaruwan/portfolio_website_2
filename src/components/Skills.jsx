import { motion } from 'framer-motion'
import { skillCategories } from '../data/skills'
import { Code2, Layout, Brain, Wrench } from 'lucide-react'

const iconMap = { Code2, Layout, Brain, Wrench }

const categoryColors = {
  languages: {
    border: 'hover:border-[#B6FF5C]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(182,255,92,0.12)]',
    badge: 'bg-[#B6FF5C]/8 text-[#B6FF5C] border-[#B6FF5C]/20',
  },
  frontend: {
    border: 'hover:border-[#8B5CF6]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.12)]',
    badge: 'bg-[#8B5CF6]/8 text-[#8B5CF6] border-[#8B5CF6]/20',
  },
  ai: {
    border: 'hover:border-[#B6FF5C]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(182,255,92,0.12)]',
    badge: 'bg-[#B6FF5C]/8 text-[#B6FF5C] border-[#B6FF5C]/20',
  },
  tools: {
    border: 'hover:border-[#8B5CF6]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(139,92,246,0.12)]',
    badge: 'bg-[#8B5CF6]/8 text-[#8B5CF6] border-[#8B5CF6]/20',
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-[#08090D] relative overflow-hidden">
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <span className="section-label">What I Know</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5] mt-2">
            Technical Skills
          </h2>
          <p className="text-[#A1A1AA] mt-3 max-w-xl text-sm">
            A snapshot of the technologies and tools I work with. Always learning and expanding my stack.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {skillCategories.map((cat, ci) => {
            const Icon = iconMap[cat.icon] || Code2
            const colors = categoryColors[cat.id] || categoryColors.languages
            return (
              <motion.div
                key={cat.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={ci}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`glass-card rounded-2xl p-6 border border-white/[0.08] transition-all duration-300 ${colors.border}`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colors.badge}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="text-[#F5F5F5] font-semibold text-sm tracking-wide">{cat.label}</h3>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {cat.skills.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.92, y: 8 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: ci * 0.1 + si * 0.05 + 0.1,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-white/15 hover:bg-white/[0.07] hover:shadow-[0_0_12px_rgba(255,255,255,0.06)] transition-all duration-200 cursor-default"
                    >
                      <span className="text-base leading-none" role="img" aria-label={skill.name}>
                        {skill.icon}
                      </span>
                      <span className="text-[#F5F5F5] text-sm font-medium">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={5}
          className="text-center text-[#A1A1AA] text-xs mt-10"
        >
          Skills are continuously growing — always eager to explore new technologies.
        </motion.p>
      </div>
    </section>
  )
}
