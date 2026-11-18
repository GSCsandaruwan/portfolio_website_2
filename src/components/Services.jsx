import { motion } from 'framer-motion'
import { Globe, Layout, Eye, Pen } from 'lucide-react'
import { services } from '../data/services'

const iconMap = { Globe, Layout, Eye, Pen }
const numbers = ['01', '02', '03', '04']

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function Services() {
  return (
    <section id="services" className="section-padding bg-[#101219]">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <span className="section-label">What I Offer</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5] mt-2">
            Services
          </h2>
          <p className="text-[#A1A1AA] mt-3 max-w-xl text-sm">
            Areas where I can contribute as a freelancer or collaborator.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Globe
            return (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-[#B6FF5C]/20 group transition-all duration-300 flex flex-col"
              >
                {/* Number */}
                <span className="text-xs font-bold text-[#B6FF5C]/40 tracking-widest mb-4">
                  {numbers[i]}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#B6FF5C]/8 border border-[#B6FF5C]/15 flex items-center justify-center mb-5 group-hover:bg-[#B6FF5C]/15 transition-colors duration-200">
                  <Icon size={18} className="text-[#B6FF5C]" />
                </div>

                {/* Title */}
                <h3 className="text-[#F5F5F5] font-bold text-base mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[#A1A1AA] text-sm leading-relaxed flex-1 mb-4">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[#A1A1AA]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
