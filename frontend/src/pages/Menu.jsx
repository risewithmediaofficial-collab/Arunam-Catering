import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import {
  dosaBananaleaf,
  bananaLeafSpread,
  drumstickCurryRice,
  guestsFeast,
  livePaanStall
} from '../assets/images'

const cats = [
  {
    id: 'breakfast', label: 'Breakfast',
    img: dosaBananaleaf,
    desc: 'Start the day right with fresh, traditional South Indian breakfast items.',
    items: ['Idli with Sambar & Chutneys','Medu Vada','Ven Pongal','Kara Pongal','Masala Dosai','Plain Dosai','Rava Dosai','Upma','Kichadi','Poori Masala','Idiyappam','Appam','Filter Coffee','Tea','Fresh Juices'],
  },
  {
    id: 'lunch', label: 'Lunch',
    img: bananaLeafSpread,
    desc: 'Traditional banana leaf meals honouring authentic South Indian culinary heritage.',
    items: ['Steamed Rice','Papad','Pickle','Sambar','Rasam','Dal','Kootu','Poriyal','Mor Kuzhambu','Aviyal','Pachadi','Appalam','Curd','Buttermilk','Payasam','Kesari','Banana'],
  },
  {
    id: 'dinner', label: 'Dinner',
    img: drumstickCurryRice,
    desc: 'An elegant dinner spread for diverse tastes with rich curries and aromatic biryanis.',
    items: ['Chapati','Parotta','Naan','Poori','Veg Kurma','Paneer Butter Masala','Dal Makhani','Palak Paneer','Veg Biryani','Pulao','Raita','Salad','Gulab Jamun','Ice Cream','Halwa','Kheer'],
  },
  {
    id: 'smart', label: 'Smart Choice',
    img: guestsFeast,
    desc: 'Value-for-money packages designed for large-scale events without compromising quality.',
    items: ['Curated Value Plates','Balanced Portions','Bulk-Friendly Preparation','Quick Service System','Hygienic Packaging','Fresh Daily Preparation','Seasonal Dishes','Custom Add-ons'],
  },
  {
    id: 'custom', label: 'Customizable',
    img: livePaanStall,
    desc: 'Design your own menu — mix and match dishes tailored to your event theme.',
    items: ['Your Choice of Starters','Mix & Match Mains','Dietary Options','Regional Cuisine Specials','Live Cooking Counters','Dessert Bar Setup','Beverage Stations','Juice Counters','Chaat Counters'],
  },
]

export default function Menu() {
  const [active, setActive] = useState('breakfast')
  const cat = cats.find(c => c.id === active)

  return (
    <main>
      <PageHero
        eyebrow="Our Menu"
        title="Crafted for Every Palate"
        subtitle="Authentic South Indian cuisine with multi-cuisine options for every event and every guest."
        bgLabel="Menu Hero"
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeading
            eyebrow="Menu Categories"
            title="Fresh, Authentic & Abundant"
            subtitle="Every dish prepared with fresh ingredients and traditional recipes."
          />

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {cats.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className="text-[11px] tracking-[0.18em] uppercase font-medium px-6 py-2.5 transition-all duration-200"
                style={{
                  border: `1px solid ${active === c.id ? '#FF5C2B' : '#E6DDD2'}`,
                  background: active === c.id ? '#FF5C2B' : 'transparent',
                  color: active === c.id ? '#fff' : '#6B6560',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-2xl shadow-lg bg-neutral-900" style={{ aspectRatio: '4/3' }}>
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105" />
              </div>

              {/* Items */}
              <div>
                <p
                  className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-2"
                  style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
                >
                  {cat.label} Menu
                </p>
                <h3
                  className="text-[1.5rem] font-medium text-[#181818] mb-3"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {cat.label}
                </h3>
                <p
                  className="text-[0.88rem] text-[#6B6560] mb-7 leading-[1.7]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {cat.desc}
                </p>

                <div className="grid grid-cols-2 gap-x-4">
                  {cat.items.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-2.5 py-2.5"
                      style={{ borderBottom: '1px solid #F5F0E8' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: '#FF5C2B' }}
                      />
                      <span
                        className="text-[0.85rem] text-[#181818]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div
                  className="mt-7 p-5"
                  style={{ background: '#F8F4EE', border: '1px solid #E6DDD2' }}
                >
                  <p
                    className="text-[0.82rem] text-[#6B6560] mb-3 leading-[1.65]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Menu items may vary by season and event requirements. Contact us to create your perfect menu.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.18em] uppercase font-semibold transition-colors duration-200"
                    style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
                  >
                    Request Custom Menu <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#181818' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[9.5px] tracking-[0.38em] uppercase mb-3" style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}>Custom Planning</p>
          <h2 className="text-[1.8rem] font-medium text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Can't find the perfect menu?</h2>
          <p className="text-[0.88rem] mb-7" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>We'll build one just for you. Contact us for a free menu consultation.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-3.5 transition-all duration-250"
            style={{ background: '#FF5C2B', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E04618'}
            onMouseLeave={e => e.currentTarget.style.background = '#FF5C2B'}
          >
            Plan Your Menu <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  )
}
