import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function StatCard({ number, label, delay = 0, light = false }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`text-center px-6 py-8 border-l ${
        light ? 'border-white/15' : 'border-[#E8E2D9]'
      } first:border-l-0`}
    >
      <p
        className={`text-4xl lg:text-5xl font-bold mb-2 ${
          light ? 'text-[#C9A84C]' : 'text-[#C9A84C]'
        }`}
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {number}
      </p>
      <p className={`text-xs tracking-widest uppercase ${light ? 'text-white/60' : 'text-[#6B6560]'}`}>
        {label}
      </p>
    </motion.div>
  )
}
