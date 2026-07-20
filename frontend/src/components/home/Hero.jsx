import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'

const floatingFoods = [
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=250&h=250&q=80",
    alt: "Gourmet Pasta",
    className: "absolute top-[12%] left-[6%] w-24 h-24 md:w-32 md:h-32 xl:w-36 xl:h-36 rounded-full border-4 border-white shadow-2xl z-10",
    animate: { y: [0, -10, 0], rotate: [0, 5, 0] },
    delay: 0
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=250&h=250&q=80",
    alt: "Grilled Skewers",
    className: "absolute bottom-[16%] left-[8%] w-26 h-26 md:w-34 md:h-34 xl:w-38 xl:h-38 rounded-full border-4 border-white shadow-2xl z-10",
    animate: { y: [0, 12, 0], rotate: [0, -4, 0] },
    delay: 0.5
  },
  {
    src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=250&h=250&q=80",
    alt: "Fresh Salad",
    className: "absolute top-[15%] right-[6%] w-24 h-24 md:w-32 md:h-32 xl:w-36 xl:h-36 rounded-full border-4 border-white shadow-2xl z-10",
    animate: { y: [0, -12, 0], rotate: [0, -6, 0] },
    delay: 0.2
  },
  {
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=250&h=250&q=80",
    alt: "Healthy Meal",
    className: "absolute bottom-[18%] right-[8%] w-26 h-26 md:w-34 md:h-34 xl:w-38 xl:h-38 rounded-full border-4 border-white shadow-2xl z-10",
    animate: { y: [0, 10, 0], rotate: [0, 4, 0] },
    delay: 0.7
  }
]

const floatingIngredients = [
  {
    src: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=120&h=120&q=80", // Avocado
    className: "absolute top-[10%] right-[22%] w-10 h-10 md:w-14 md:h-14 opacity-80 z-0",
    animate: { y: [0, -6, 0], rotate: [0, 15, 0] }
  },
  {
    src: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&h=100&q=80", // Tomato
    className: "absolute bottom-[8%] left-[28%] w-10 h-10 md:w-12 md:h-12 opacity-80 z-0",
    animate: { y: [0, 8, 0], rotate: [0, -10, 0] }
  }
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF7F2] pt-24 pb-16">

      {/* Background Dotted & Dashed Waves (Visual Curve Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main top curve */}
          <path
            d="M-50 250C350 400 650 100 1100 200C1250 230 1350 350 1500 320"
            stroke="#ECE5DB"
            strokeWidth="2.5"
            strokeDasharray="8 8"
          />
          {/* Main bottom curve */}
          <path
            d="M-100 650C300 500 700 750 1200 550C1350 490 1450 600 1550 580"
            stroke="#ECE5DB"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Top light orange highlight circles */}
          <circle cx="200" cy="180" r="140" fill="rgba(255, 92, 43, 0.025)" />
          <circle cx="1200" cy="700" r="180" fill="rgba(255, 92, 43, 0.025)" />
        </svg>
      </div>

      {/* Floating Food Circles */}
      {floatingFoods.map((food, idx) => (
        <motion.div
          key={idx}
          className={`${food.className} hidden md:block`}
          animate={food.animate}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: food.delay
          }}
        >
          <img
            src={food.src}
            alt={food.alt}
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      ))}

      {/* Floating Ingredient Visuals */}
      {floatingIngredients.map((ing, idx) => (
        <motion.div
          key={idx}
          className={`${ing.className} hidden lg:block`}
          animate={ing.animate}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }}
        >
          <img
            src={ing.src}
            alt="Ingredient"
            className="w-full h-full object-cover rounded-full mix-blend-multiply"
          />
        </motion.div>
      ))}

      {/* Floating Cartoon Chef Mascot (Left) */}
      <motion.div
        className="absolute bottom-[10%] left-[2%] w-24 h-24 md:w-34 md:h-34 xl:w-40 xl:h-40 z-20 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
      >
        <img
          src="/chef_cartoon_vector.png"
          alt="Cartoon Chef Mascot"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center pt-8 pb-10">

        {/* Main H1 Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#111] leading-[1.12] tracking-tight mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Exceptional Catering for <br />
          <span className="text-[#FF5C2B] italic font-serif font-normal">Unforgettable</span> Celebrations
        </motion.h1>

        {/* Sub-paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[0.95rem] md:text-[1.05rem] text-[#7A7269] leading-relaxed max-w-xl mx-auto mb-10"
        >
          We accept catering orders for events with a minimum of 300 guests. Perfect for events, parties, and special gatherings. Book now!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/contact"
            className="text-[11px] tracking-[0.15em] uppercase font-extrabold px-8 py-4 rounded-full transition-all duration-300 bg-[#FF5C2B] text-white hover:bg-[#E04618] shadow-lg shadow-[#FF5C2B]/15 hover:shadow-xl hover:scale-[1.03]"
          >
            Book Catering
          </Link>
          <Link
            to="/menu"
            className="text-[11px] tracking-[0.15em] uppercase font-extrabold px-8 py-4 rounded-full transition-all duration-300 border border-[#ECE5DB] bg-white text-[#111] hover:bg-neutral-50 shadow-sm hover:scale-[1.03]"
          >
            View Menu
          </Link>
        </motion.div>

        {/* Mobile-only Food Grid (for small screen layout support) */}
        <div className="grid grid-cols-2 gap-4 mt-12 md:hidden">
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&h=200&q=80"
            alt="Food plate"
            className="w-full aspect-square object-cover rounded-2xl border-2 border-white shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=200&h=200&q=80"
            alt="Food plate"
            className="w-full aspect-square object-cover rounded-2xl border-2 border-white shadow-md"
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="hidden md:flex flex-col items-center gap-1.5 mt-16"
        >
          <span className="text-[8.5px] tracking-[0.35em] uppercase font-bold text-[#7A7269]">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown size={14} className="text-[#7A7269]" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
