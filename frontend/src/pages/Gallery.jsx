import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import {
  dosaBananaleaf,
  welcomeDrinks,
  chefsServing,
  coupleDining,
  livePaanStall,
  liveFruitStall,
  grandHallDining,
  guestsFeast,
  bananaLeafSpread,
  sweetPaanLeaf,
  riceSambar,
  drumstickCurryRice,
  gulabJamunTray,
  serviceTeamInAction,
  yellowDiningHall,
  diningHallPerspective
} from '../assets/images'

const categories = ['All', 'Weddings', 'Corporate', 'Setups', 'Food', 'Live Stalls']

const galleryItems = [
  { label: 'Grand Traditional Dining Hall', src: grandHallDining, cat: 'Setups', wide: true },
  { label: 'Bride & Groom Wedding Feast', src: coupleDining, cat: 'Weddings' },
  { label: 'Crispy South Indian Dosa', src: dosaBananaleaf, cat: 'Food' },
  { label: 'Service Staff Serving Guests', src: serviceTeamInAction, cat: 'Weddings' },
  { label: 'Welcome Drink Cups Counter', src: welcomeDrinks, cat: 'Live Stalls' },
  { label: 'South Indian Full Banana Leaf Feast', src: bananaLeafSpread, cat: 'Food', wide: true },
  { label: 'Live Paan Counter Stall', src: livePaanStall, cat: 'Live Stalls' },
  { label: 'Live Fruit Counter Stall', src: liveFruitStall, cat: 'Live Stalls' },
  { label: 'Catering Chefs in Action', src: chefsServing, cat: 'Weddings', wide: true },
  { label: 'Yellow Dining Hall Arrangement', src: yellowDiningHall, cat: 'Setups' },
  { label: 'Golden Gulab Jamun Dessert Cups', src: gulabJamunTray, cat: 'Food' },
  { label: 'Guests Enjoying Catering Feast', src: guestsFeast, cat: 'Corporate' },
  { label: 'Paan & Sweet Betel Leaf', src: sweetPaanLeaf, cat: 'Live Stalls' },
  { label: 'Authentic Rice & Sambar', src: riceSambar, cat: 'Food' },
  { label: 'Drumstick Curry & Rice Meal', src: drumstickCurryRice, cat: 'Food' },
  { label: 'Perspective Dining Hall Setup', src: diningHallPerspective, cat: 'Setups' },
]

export default function Gallery() {
  const [activecat, setActivecat] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = activecat === 'All' ? galleryItems : galleryItems.filter(g => g.cat === activecat)

  return (
    <main>
      <PageHero
        eyebrow="Gallery"
        title="Moments We've Catered"
        subtitle="A visual journey through thousands of celebrations, grand setups, and unforgettable events."
        bgLabel="Gallery Hero"
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeading
            eyebrow="Visual Story"
            title="Every Event, Beautifully Served"
          />

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActivecat(cat)}
                className="text-[11px] tracking-[0.18em] uppercase font-medium px-5 py-2.5 transition-all duration-200"
                style={{
                  border: `1px solid ${activecat === cat ? '#FF5C2B' : '#E6DDD2'}`,
                  background: activecat === cat ? '#FF5C2B' : 'transparent',
                  color: activecat === cat ? '#fff' : '#6B6560',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filtered.map((item, i) => (
              <motion.div
                key={item.label}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                onClick={() => setLightbox(item)}
                className={`overflow-hidden group cursor-pointer relative bg-neutral-900 ${item.wide ? 'col-span-2' : ''}`}
                style={{ aspectRatio: item.wide ? '2/1' : '1/1' }}
              >
                <img src={item.src} alt={item.label} className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 bg-black/50 opacity-0 group-hover:opacity-100"
                >
                  <p
                    className="text-[11px] text-white tracking-wider text-center px-3 translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </p>
                  <span
                    className="text-[9px] tracking-[0.25em] uppercase text-[#FF5C2B]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.cat}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
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
    </main>
  )
}
