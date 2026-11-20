import { useEffect, useRef } from 'react'

export default function MouseGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    // Disable on touch devices or if user prefers reduced motion
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReducedMotion) return

    const glowEl = glowRef.current
    if (!glowEl) return

    let mouseX = -500
    let mouseY = -500
    let currentX = -500
    let currentY = -500
    let isVisible = false
    let animId

    const onPointerMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) {
        isVisible = true
        glowEl.style.opacity = '1'
      }
    }

    const onMouseLeave = () => {
      isVisible = false
      glowEl.style.opacity = '0'
    }

    const onMouseEnter = () => {
      isVisible = true
      glowEl.style.opacity = '1'
    }

    const render = () => {
      // Smooth linear interpolation trailing
      currentX += (mouseX - currentX) * 0.075
      currentY += (mouseY - currentY) * 0.075

      glowEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
      animId = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[550px] h-[550px] rounded-full pointer-events-none z-0 transition-opacity duration-700 opacity-0 will-change-transform max-md:hidden"
      style={{
        background:
          'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(182, 255, 92, 0.04) 40%, rgba(8, 9, 13, 0) 70%)',
        filter: 'blur(40px)',
      }}
      aria-hidden="true"
    />
  )
}
