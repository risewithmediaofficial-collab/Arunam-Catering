import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const items = [
  { label: 'Traditional Elephant Welcome', wide: true },
  { label: 'Wedding Decoration' },
  { label: 'Couple Dining Setup' },
  { label: 'Wedding Drum Show' },
  { label: 'Live Juice Counter' },
  { label: 'Reception Setup', wide: true },
  { label: 'Personalized Dining Tables' },
  { label: 'Food Service Staff' },
  { label: 'Royal Dining Experience' },
]

export default function GalleryPreview() {
  const { ref, inView } = useInView({ threshold: 0.06, triggerOnce: true })
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <p
              className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-2.5"
              style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
            >
              Our Gallery
            </p>
            <h2
              className="text-3xl lg:text-[2.2rem] font-medium text-[#181818] leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Moments We've Catered
            </h2>
          </div>
          <Link
            to="/gallery"
            className="shrink-0 inline-flex items-center gap-2 text-[10.5px] tracking-[0.2em] uppercase font-semibold pb-px transition-colors duration-200"
            style={{ color: '#181818', borderBottom: '1px solid #181818' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FF5C2B'; e.currentTarget.style.borderBottomColor = '#FF5C2B' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#181818'; e.currentTarget.style.borderBottomColor = '#181818' }}
          >
            View All <ArrowRight size={11} />
          </Link>
        </div>

        {/* Grid */}
        <div
          ref={ref}
          className="grid grid-cols-3 gap-2.5"
          style={{ gridAutoRows: '180px' }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group overflow-hidden cursor-pointer relative ${item.wide ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="absolute inset-0">
                <ImagePlaceholder label={item.label} aspectRatio="" className="w-full h-full" />
              </div>
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-end p-4 transition-all duration-300"
                style={{ background: 'rgba(24,24,24,0)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(24,24,24,0.55)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(24,24,24,0)'}
              >
                <p
                  className="text-[11px] text-white tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
