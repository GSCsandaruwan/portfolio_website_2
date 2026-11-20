import { motion } from 'framer-motion'
import { Globe, Layout, Eye, Pen } from 'lucide-react'
import { services } from '../data/services'

const iconMap = { Globe, Layout, Eye, Pen }
const numbers = ['01', '02', '03', '04']

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Services() {
  return (
    <section id="services" className="section-padding bg-[#101219] relative overflow-hidden">
      <div className="container-custom relative z-10">
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
            Areas where I can contribute as a freelancer, intern, or technical collaborator.
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
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-[#B6FF5C]/35 hover:shadow-[0_15px_30px_rgba(0,0,0,0.45),0_0_20px_rgba(182,255,92,0.1)] group transition-all duration-300 flex flex-col cursor-default"
              >
                {/* Number */}
                <span className="text-xs font-bold text-[#B6FF5C]/40 group-hover:text-[#B6FF5C]/80 tracking-widest mb-4 transition-colors">
                  {numbers[i]}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#B6FF5C]/8 border border-[#B6FF5C]/15 flex items-center justify-center mb-5 group-hover:bg-[#B6FF5C]/20 group-hover:border-[#B6FF5C]/40 group-hover:scale-105 transition-all duration-300">
                  <Icon size={20} className="text-[#B6FF5C]" />
                </div>

                {/* Title */}
                <h3 className="text-[#F5F5F5] font-bold text-base mb-2 group-hover:text-white transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[#A1A1AA] text-sm leading-relaxed flex-1 mb-5">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.05]">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[#A1A1AA] group-hover:border-white/12 transition-colors"
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
