import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import ImagePlaceholder from '../components/ui/ImagePlaceholder'

const categories = ['All', 'Weddings', 'Corporate', 'Setups', 'Food', 'Decor']

const galleryItems = [
  { label: 'Traditional Elephant Welcome', cat: 'Weddings', wide: true },
  { label: 'Wedding Decoration', cat: 'Decor' },
  { label: 'Couple Dining Setup', cat: 'Setups' },
  { label: 'Wedding Drum Show', cat: 'Weddings' },
  { label: 'Live Juice Counter', cat: 'Food' },
  { label: 'Reception Setup', cat: 'Setups', wide: true },
  { label: 'Personalized Dining Tables', cat: 'Setups' },
  { label: 'Food Service Staff', cat: 'Weddings' },
  { label: 'Royal Dining Experience', cat: 'Setups', wide: true },
  { label: 'Grand Wedding Stage', cat: 'Decor' },
  { label: 'Traditional Seervarisai Display', cat: 'Weddings' },
  { label: 'Beverage Station', cat: 'Food' },
  { label: 'Hygienic Plate Setup', cat: 'Food' },
  { label: 'Corporate Lunch Spread', cat: 'Corporate' },
  { label: 'Banana Leaf Meal', cat: 'Food' },
  { label: 'Dessert Counter', cat: 'Food' },
  { label: 'Live Cooking Station', cat: 'Food' },
  { label: 'Wedding Mandap Setup', cat: 'Decor' },
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
                className={`overflow-hidden group cursor-pointer relative bg-[#EDE5D8] ${item.wide ? 'col-span-2' : ''}`}
                style={{ aspectRatio: item.wide ? '2/1' : '1/1' }}
              >
                <ImagePlaceholder label={item.label} className="absolute inset-0 w-full h-full" />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all duration-300"
                  style={{ background: 'rgba(24,24,24,0)', backdropFilter: 'blur(0px)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(24,24,24,0.55)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(24,24,24,0)' }}
                >
                  <p
                    className="text-[11px] text-white tracking-wider text-center px-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </p>
                  <span
                    className="text-[9px] tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
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
              className="max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div style={{ aspectRatio: '4/3', background: '#222' }}>
                <ImagePlaceholder label={lightbox.label} aspectRatio="aspect-[4/3]" className="w-full h-full" />
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-[0.88rem] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{lightbox.label}</p>
                <span className="text-[10px] tracking-widest uppercase" style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}>{lightbox.cat}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
