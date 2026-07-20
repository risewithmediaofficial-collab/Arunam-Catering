import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', light = false }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <div
      ref={ref}
      className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-3"
          style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.08 }}
        className={`text-3xl lg:text-[2.6rem] xl:text-[3rem] font-medium leading-[1.12] tracking-[-0.01em] ${
          light ? 'text-white' : 'text-[#181818]'
        }`}
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.16 }}
          className={`mt-4 text-[0.9rem] leading-[1.7] max-w-[520px] ${
            align === 'center' ? 'mx-auto' : ''
          } ${light ? 'text-white/55' : 'text-[#6B6560]'}`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
        className={`mt-5 h-px origin-left ${align === 'center' ? 'mx-auto' : ''}`}
        style={{ width: 40, background: 'rgba(184,137,46,0.4)' }}
      />
    </div>
  )
}
