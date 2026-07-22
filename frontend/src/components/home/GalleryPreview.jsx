import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import useLockBodyScroll from '../../hooks/useLockBodyScroll'
import {
  coupleDining,
  grandHallDining,
  guestsFeast,
  bananaLeafSpread,
  welcomeDrinks,
  livePaanStall,
  liveFruitStall,
  gulabJamunTray,
  serviceTeamInAction
} from '../../assets/images'

const items = [
  { label: 'Grand Traditional Dining Setup', src: grandHallDining, wide: true, cat: 'Setups' },
  { label: 'Wedding Couple Feast', src: coupleDining, cat: 'Wedding' },
  { label: 'Live Fruit Counter Stall', src: liveFruitStall, cat: 'Live Stalls' },
  { label: 'South Indian Banana Leaf Feast', src: bananaLeafSpread, cat: 'Food' },
  { label: 'Welcome Drinks Counter', src: welcomeDrinks, cat: 'Live Stalls' },
  { label: 'Catering Service Team in Action', src: serviceTeamInAction, wide: true, cat: 'Team' },
  { label: 'Guests Banana Leaf Dining', src: guestsFeast, cat: 'Corporate' },
  { label: 'Live Paan Counter Counter', src: livePaanStall, cat: 'Live Stalls' },
  { label: 'Golden Gulab Jamun Dessert Tray', src: gulabJamunTray, cat: 'Food' },
]

export default function GalleryPreview() {
  const [lightbox, setLightbox] = useState(null)
  const { ref, inView } = useInView({ threshold: 0.06, triggerOnce: true })

  // Lock background scroll when image lightbox is open
  useLockBodyScroll(!!lightbox)

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
              onClick={() => setLightbox(item)}
              className={`group overflow-hidden cursor-pointer relative bg-neutral-900 ${item.wide ? 'col-span-2' : 'col-span-1'}`}
            >
              <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-end p-4 transition-all duration-300 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100"
              >
                <p
                  className="text-[11px] text-white font-medium tracking-wider transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(10,10,10,0.95)' }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C2B'; e.currentTarget.style.color = '#FF5C2B' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <motion.div
              initial={{ scale: 0.93 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.93 }}
              className="max-w-3xl w-full overflow-hidden rounded-2xl bg-neutral-900 p-2"
              onClick={e => e.stopPropagation()}
            >
              <div style={{ aspectRatio: '16/10' }} className="overflow-hidden rounded-xl">
                <img src={lightbox.src} alt={lightbox.label} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between mt-3 px-3 pb-2">
                <p className="text-[0.88rem] font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{lightbox.label}</p>
                <span className="text-[10px] tracking-widest uppercase text-[#FF5C2B]" style={{ fontFamily: 'Inter, sans-serif' }}>{lightbox.cat}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
