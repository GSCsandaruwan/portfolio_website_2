import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, Calendar, Code2 } from 'lucide-react'

const educationData = {
  degree: 'Bachelor of Information Technology',
  university: 'University of Ruhuna',
  faculty: 'Faculty of Humanities and Social Sciences',
  startYear: '2022',
  expectedGrad: '2026',
  status: 'Undergraduate (In Progress)',
  coursework: [
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'Database Management Systems',
    'Web Technologies',
    'Software Engineering',
    'Computer Networks',
    'Artificial Intelligence',
    'Mobile Application Development',
  ],
}

const activitiesData = [
  {
    title: 'IntelliFlow AI — Personal Project',
    type: 'Independent Development',
    period: '2024',
    description:
      'Designed and developed a computer vision-based adaptive traffic control system using Python and YOLOv8. Implemented real-time vehicle detection and an emergency vehicle preemption mechanism.',
    tags: ['Python', 'YOLOv8', 'OpenCV', 'Computer Vision'],
    icon: Code2,
  },
  {
    title: 'Facebook Reels Downloader — Browser Extension',
    type: 'Personal Project',
    period: '2024',
    description:
      'Explored Chrome Extension development with Manifest V3, investigating client-side media detection and browser-based download workflows.',
    tags: ['JavaScript', 'Chrome Extensions', 'Manifest V3'],
    icon: Code2,
  },
  {
    title: 'Portfolio Website',
    type: 'Personal Development',
    period: '2024',
    description:
      'Built a fully responsive personal portfolio using React, Vite, and Tailwind CSS to showcase projects, skills, and professional presence.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    icon: Code2,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Education() {
  return (
    <section id="experience" className="section-padding bg-[#08090D] relative overflow-hidden">
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-14"
        >
          <span className="section-label">My Journey</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5] mt-2">
            Experience &amp; Education
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Education */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={1}
              className="flex items-center gap-2 mb-6"
            >
              <GraduationCap size={18} className="text-[#B6FF5C]" />
              <h3 className="text-[#F5F5F5] font-semibold text-lg">Education</h3>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={2}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-6 border border-white/[0.08] hover:border-[#B6FF5C]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(182,255,92,0.1)] transition-all duration-300"
            >
              {/* Year badge */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B6FF5C]">
                  <Calendar size={12} />
                  {educationData.startYear} — {educationData.expectedGrad}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#B6FF5C]/8 border border-[#B6FF5C]/20 text-[#B6FF5C] font-semibold">
                  In Progress
                </span>
              </div>

              {/* Institution */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#B6FF5C]/8 border border-[#B6FF5C]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap size={20} className="text-[#B6FF5C]" />
                </div>
                <div>
                  <h4 className="text-[#F5F5F5] font-bold text-base leading-snug">{educationData.university}</h4>
                  <p className="text-[#A1A1AA] text-sm mt-0.5">{educationData.faculty}</p>
                  <p className="text-[#B6FF5C] text-xs font-medium mt-1">{educationData.status}</p>
                </div>
              </div>

              {/* Coursework */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={13} className="text-[#A1A1AA]" />
                  <p className="text-[#A1A1AA] text-xs uppercase tracking-widest font-semibold">
                    Relevant Coursework
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {educationData.coursework.map((course) => (
                    <span
                      key={course}
                      className="text-xs px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#A1A1AA] hover:border-white/15 hover:text-[#F5F5F5] transition-colors cursor-default"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Activities / Experience */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={1}
              className="flex items-center gap-2 mb-6"
            >
              <Code2 size={18} className="text-[#8B5CF6]" />
              <h3 className="text-[#F5F5F5] font-semibold text-lg">Projects &amp; Activities</h3>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-5 top-2 bottom-4 w-px bg-gradient-to-b from-[#B6FF5C]/40 via-[#8B5CF6]/30 to-transparent" />

              <div className="space-y-5">
                {activitiesData.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: i * 0.12 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="relative pl-14 group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-4 w-10 h-10 rounded-xl bg-[#141720] border border-white/[0.08] flex items-center justify-center z-10 group-hover:border-[#8B5CF6]/40 group-hover:bg-[#8B5CF6]/10 group-hover:scale-105 transition-all duration-300">
                        <Icon size={15} className="text-[#8B5CF6]" />
                      </div>

                      <motion.div
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card rounded-xl p-5 border border-white/[0.08] hover:border-[#8B5CF6]/30 hover:shadow-[0_8px_25px_rgba(0,0,0,0.4),0_0_15px_rgba(139,92,246,0.1)] transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-[#F5F5F5] font-semibold text-sm leading-snug group-hover:text-white transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-xs text-[#A1A1AA] flex-shrink-0 font-medium">
                            {item.period}
                          </span>
                        </div>
                        <p className="text-[#8B5CF6] text-xs font-medium mb-2">{item.type}</p>
                        <p className="text-[#A1A1AA] text-xs leading-relaxed mb-3">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[#A1A1AA] hover:border-white/12 hover:text-[#F5F5F5] transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
