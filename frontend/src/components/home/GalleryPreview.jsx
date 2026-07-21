import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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
  { label: 'Grand Traditional Dining Setup', src: grandHallDining, wide: true },
  { label: 'Wedding Couple Feast', src: coupleDining },
  { label: 'Live Fruit Counter Stall', src: liveFruitStall },
  { label: 'South Indian Banana Leaf Feast', src: bananaLeafSpread },
  { label: 'Welcome Drinks Counter', src: welcomeDrinks },
  { label: 'Catering Service Team in Action', src: serviceTeamInAction, wide: true },
  { label: 'Guests Banana Leaf Dining', src: guestsFeast },
  { label: 'Live Paan Counter Counter', src: livePaanStall },
  { label: 'Golden Gulab Jamun Dessert Tray', src: gulabJamunTray },
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
              className={`group overflow-hidden cursor-pointer relative bg-neutral-900 ${item.wide ? 'col-span-2' : 'col-span-1'}`}
            >
              <img
                src={item.src}
                alt={item.label}
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
    </section>
  )
}
