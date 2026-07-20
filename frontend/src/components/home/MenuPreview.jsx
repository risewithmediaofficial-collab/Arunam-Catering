import { motion } from 'framer-motion'
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const promoItems = [
  {
    tag: "20% OFF UPTO $50",
    tagColor: "bg-[#FF5C2B]",
    title: "Quinoa Buddha Bowl",
    category: "Healthy",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=300&q=80",
    rating: "4.8 Rating",
    time: "Time: 10-15 min",
    distance: "0.2 km"
  },
  {
    tag: "BUY 1 GET 1 FREE FOR TODAY",
    tagColor: "bg-emerald-600",
    title: "Avocado Toast",
    category: "Burgers & Healthy",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&h=300&q=80",
    rating: "4.9 Rating",
    time: "Time: 30-45 min",
    distance: "2.6 km"
  },
  {
    tag: "FLAT $40 OFF ON COMBO",
    tagColor: "bg-blue-600",
    title: "Green Smoothie",
    category: "Mexican & Juices",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&h=300&q=80",
    rating: "4.7 Rating",
    time: "Time: 10-15 min",
    distance: "0.9 km"
  }
]

export default function MenuPreview() {
  return (
    <section className="py-20 md:py-24 bg-[#FAF7F2] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#FF5C2B] mb-2 block">
              Menu Spotlight
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111] leading-tight">
              Featured Menu <span className="text-[#FF5C2B]">Offers</span>
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-extrabold text-[#FF5C2B] hover:text-[#E04618] transition-colors mt-4 md:mt-0"
          >
            Explore Full Menu <ArrowRight size={13} />
          </Link>
        </div>

        {/* Promo Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promoItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#ECE5DB] flex flex-col group"
            >
              {/* Image & Promo Badge */}
              <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Promo Badge Tag */}
                <div className={`absolute top-4 left-4 ${item.tagColor} text-white font-extrabold text-[9px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm`}>
                  {item.tag}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-[#7A7269] uppercase font-bold tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-bold text-[#111] mb-4 group-hover:text-[#FF5C2B] transition-colors">
                    {item.title}
                  </h4>
                </div>

                {/* Rating Stats Footer */}
                <div className="flex items-center justify-between text-[11px] text-[#7A7269] pt-4 border-t border-[#ECE5DB]/60">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-[#FF5C2B] stroke-[#FF5C2B]" />
                    <span className="font-semibold text-[#111]">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{item.distance}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
