import { motion } from 'framer-motion'
import { Users, UtensilsCrossed, Clock, ShieldCheck } from 'lucide-react'

const cards = [
  {
    title: "Skilled Catering Team",
    desc: "Our chefs and service staff are trained to handle events of all sizes. We work with care and attention to ensure every dish is prepared and served perfectly.",
    gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%)",
    icon: <Users className="w-10 h-10 text-sky-500" />
  },
  {
    title: "Fresh Ingredients, Great Taste",
    desc: "We use fresh vegetables, quality ingredients, and well-tested recipes to deliver consistent taste that guests enjoy and remember.",
    gradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(249, 115, 22, 0.12) 100%)",
    icon: <UtensilsCrossed className="w-10 h-10 text-amber-500" />
  },
  {
    title: "On-Time & Stress-Free Service",
    desc: "We value your time. Our team arrives on schedule, manages food service efficiently, and ensures everything runs smoothly without last-minute issues.",
    gradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)",
    icon: <Clock className="w-10 h-10 text-emerald-500" />
  },
  {
    title: "Clean Kitchens & Safe Practices",
    desc: "Food safety is our priority. We maintain clean cooking areas, follow proper hygiene methods, and ensure safe food handling from kitchen to serving.",
    gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%)",
    icon: <ShieldCheck className="w-10 h-10 text-purple-500" />
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#FF5C2B] mb-2 block">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111] leading-tight mb-4">
            Making Every Event <span className="text-[#FF5C2B]">Effortless & Memorable</span>
          </h2>
          <p className="text-[0.92rem] text-[#7A7269] leading-relaxed">
            Our commitment to taste, hygiene, and timely service ensures your celebrations run smoothly.
          </p>
        </div>

        {/* 4 Gradient Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative rounded-3xl p-6.5 overflow-hidden border border-[#ECE5DB] shadow-sm flex flex-col items-center text-center min-h-[320px]"
              style={{ background: card.gradient }}
            >
              {/* Floating inner glass layer */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md -z-10" />

              {/* Icon Container with animation */}
              <div className="w-18 h-18 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>

              {/* Card Title */}
              <h3 className="text-[15px] font-bold text-[#111] mb-3">
                {card.title}
              </h3>

              {/* Card Description */}
              <p className="text-[12.5px] text-[#7A7269] leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
