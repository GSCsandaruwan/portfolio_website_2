import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { projects } from '../data/projects'
import { VenomButton } from '@/components/venom-button'

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

const categoryColorMap = {
  lime: {
    badge: 'bg-[#B6FF5C]/10 text-[#B6FF5C] border-[#B6FF5C]/25',
    glow: 'rgba(182,255,92,0.1)',
    hoverBorder: 'hover:border-[#B6FF5C]/40',
  },
  purple: {
    badge: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/25',
    glow: 'rgba(139,92,246,0.1)',
    hoverBorder: 'hover:border-[#8B5CF6]/40',
  },
}

const placeholderGradients = {
  AI: 'from-[#8B5CF6]/20 via-[#141720] to-[#B6FF5C]/10',
  EXT: 'from-[#B6FF5C]/15 via-[#141720] to-[#101219]',
  WEB: 'from-[#B6FF5C]/10 via-[#141720] to-[#8B5CF6]/15',
}

function ProjectCard({ project, index }) {
  const colors = categoryColorMap[project.categoryColor] || categoryColorMap.lime
  const gradClass = placeholderGradients[project.imagePlaceholder] || placeholderGradients.WEB

  return (
    <motion.article
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`glass-card rounded-2xl border border-white/[0.08] ${colors.hoverBorder} transition-all duration-300 flex flex-col hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)]`}
      style={{
        boxShadow: `0 0 40px ${colors.glow}`,
      }}
    >
      {/* Project image / placeholder */}
      <div className={`relative h-48 bg-gradient-to-br ${gradClass} rounded-t-2xl overflow-hidden flex-shrink-0`}>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-3xl font-black text-gradient opacity-40 tracking-widest group-hover:scale-110 transition-transform duration-500">
              {project.imagePlaceholder}
            </span>
            <span className="text-[#A1A1AA] text-xs">Project Preview</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors.badge} backdrop-blur-md`}>
            {project.category}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
          {project.github && project.github !== '#' && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#B6FF5C] hover:text-[#08090D] hover:border-[#B6FF5C] hover:scale-110 transition-all duration-200"
              aria-label={`${project.title} GitHub repository`}
            >
              <GithubIcon size={16} />
            </a>
          )}
          {project.demo && project.demo !== '#' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#B6FF5C] hover:text-[#08090D] hover:border-[#B6FF5C] hover:scale-110 transition-all duration-200"
              aria-label={`${project.title} live demo`}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[#F5F5F5] font-bold text-lg mb-2 group-hover:text-[#B6FF5C] transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/[0.04] border border-white/[0.07] text-[#A1A1AA] hover:border-white/15 hover:text-[#F5F5F5] transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer links */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06] mt-auto">
          {project.github && (
            <a
              href={project.github}
              target={project.github !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#B6FF5C] transition-colors font-medium group/link"
              aria-label="View on GitHub"
            >
              <GithubIcon size={13} className="group-hover/link:rotate-6 transition-transform" />
              <span>{project.github === '#' ? 'Coming Soon' : 'View on GitHub'}</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target={project.demo !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#B6FF5C] transition-colors font-medium ml-auto group/link"
              aria-label="View live demo"
            >
              <ExternalLink size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              <span>{project.demo === '#' ? 'Demo Soon' : 'Live Demo'}</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section-padding bg-[#101219] relative overflow-visible">
      <div className="container-custom relative z-10 overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <span className="section-label">What I&apos;ve Built</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5F5] mt-2">
            Featured Projects
          </h2>
          <p className="text-[#A1A1AA] mt-3 max-w-xl text-sm">
            A collection of personal and academic projects that reflect my growth as a developer and my passion for building meaningful solutions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* CTA - View more on GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex items-center justify-center overflow-visible relative z-20"
        >
          <VenomButton
            href="https://github.com/GSCsandaruwan"
            label="View more on GitHub"
            className="w-full max-w-2xl mx-auto overflow-visible"
            height={200}
          />
        </motion.div>
      </div>
    </section>
  )
}
