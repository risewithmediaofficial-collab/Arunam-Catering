import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function OrderCTA() {
  return (
    <section className="bg-[#111] py-14 overflow-hidden relative">
      {/* Decorative radial blur */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#FF5C2B]/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FF5C2B]/10 blur-[90px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-center">
          
          {/* Left Food Image */}
          <div className="md:col-span-3 flex justify-center md:justify-start">
            <motion.div
              initial={{ rotate: -15, scale: 0.9, opacity: 0 }}
              whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-white/5 overflow-hidden shadow-2xl relative"
            >
              <img
                src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=300&h=300&q=80"
                alt="Grilled Chicken"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </div>

          {/* Center Call to Action */}
          <div className="md:col-span-6 text-center px-4">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#FF5C2B] mb-2.5 block">
              Direct Ordering
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4 font-serif">
              Order Delicious Food <br />
              Right to Your <span className="text-[#FF5C2B]">Doorstep</span>
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-6 max-w-sm mx-auto">
              Craving something tasty? Order now for best catering-level meals delivered fresh.
            </p>
            <button className="inline-flex items-center gap-2.5 text-[11px] tracking-widest uppercase font-bold bg-[#FF5C2B] text-white px-7 py-3.5 rounded-full hover:bg-[#E04618] hover:scale-105 transition-all shadow-lg shadow-[#FF5C2B]/10">
              Order Now <ArrowRight size={12} />
            </button>
          </div>

          {/* Right Food Image (vertical orange pill frame) */}
          <div className="md:col-span-3 flex justify-center md:justify-end">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-36 py-6 px-4 bg-[#FF5C2B] rounded-[4rem] flex flex-col items-center gap-4 shadow-xl"
            >
              <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1625938146369-adc83368bda7?auto=format&fit=crop&w=300&h=300&q=80"
                  alt="Shrimp Scampi"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[9px] tracking-wider uppercase font-bold text-white text-center leading-tight">
                Shrimp <br />
                Scampi
              </span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
