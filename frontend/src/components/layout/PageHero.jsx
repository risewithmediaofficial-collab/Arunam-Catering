import { motion } from 'framer-motion'
import ImagePlaceholder from '../ui/ImagePlaceholder'

export default function PageHero({ eyebrow, title, subtitle, bgLabel = 'Page Hero' }) {
  return (
    <section
      className="relative flex items-end pt-36 pb-16 md:pb-20 overflow-hidden"
      style={{ background: '#FAF7F2', minHeight: 340 }}
    >
      {/* BG with Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <ImagePlaceholder label={bgLabel} className="absolute inset-0 w-full h-full grayscale opacity-20" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 92, 43, 0.08) 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Left orange accent line */}
      <div
        className="absolute left-0 top-1/4 bottom-1/4"
        style={{ width: 3, background: 'linear-gradient(to bottom, transparent, #FF5C2B, transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[10px] tracking-[0.42em] uppercase font-bold mb-3"
          style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl md:text-5xl lg:text-[3rem] font-extrabold text-[#111] leading-[1.1] max-w-2xl"
          style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.01em' }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4 text-[0.88rem] max-w-xl leading-[1.7]"
            style={{ color: '#7A7269', fontFamily: 'Inter, sans-serif' }}
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-7 origin-left"
          style={{ width: 44, height: 2, background: '#FF5C2B', opacity: 0.8 }}
        />
      </div>
    </section>
  )
}
