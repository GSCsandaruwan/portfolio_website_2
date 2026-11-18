import { motion } from 'framer-motion'
import { skillCategories } from '../data/skills'
import { Code2, Layout, Brain, Wrench } from 'lucide-react'

const iconMap = { Code2, Layout, Brain, Wrench }

const categoryColors = {
  languages: { border: 'hover:border-[#B6FF5C]/30', badge: 'bg-[#B6FF5C]/8 text-[#B6FF5C] border-[#B6FF5C]/20' },
  frontend: { border: 'hover:border-[#8B5CF6]/30', badge: 'bg-[#8B5CF6]/8 text-[#8B5CF6] border-[#8B5CF6]/20' },
  ai: { border: 'hover:border-[#B6FF5C]/30', badge: 'bg-[#B6FF5C]/8 text-[#B6FF5C] border-[#B6FF5C]/20' },
  tools: { border: 'hover:border-[#8B5CF6]/30', badge: 'bg-[#8B5CF6]/8 text-[#8B5CF6] border-[#8B5CF6]/20' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
}

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-[#08090D]">
      <div className="container-custom">
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
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={ci}
                className={`glass-card rounded-2xl p-6 border border-white/[0.08] transition-all duration-300 ${colors.border}`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colors.badge}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="text-[#F5F5F5] font-semibold text-sm">{cat.label}</h3>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {cat.skills.map((skill, si) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: ci * 0.08 + si * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200 cursor-default"
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
