import { motion } from 'framer-motion'
import { Heart, Trophy, Radio, BookOpen, Star } from 'lucide-react'

export default function Masterclass() {
  const images = [
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&h=600&q=80",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=400&h=600&q=80",
    "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&h=600&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&h=600&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&h=600&q=80"
  ]

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Background soft paths */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 200C300 100 800 500 1500 300" stroke="#FF5C2B" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M-50 450C400 600 700 300 1600 500" stroke="#FF5C2B" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#FF5C2B] mb-2 block">
            Cooking Masterclass
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111] leading-tight mb-4">
            Master the Art of <span className="text-[#FF5C2B]">Cooking with Confidence</span>
          </h2>
          <p className="text-[0.92rem] text-[#7A7269] leading-relaxed">
            Explore step-by-step recipes from around the world and turn every meal into a masterpiece.
          </p>
        </div>

        {/* Recipe / Masterclass Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          
          {/* Card 1: Vegetable Chopping Chef */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-900 group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&h=500&q=80"
              alt="Chopping vegetables"
              className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[9px] tracking-wider font-bold bg-[#FF5C2B] px-2 py-0.5 rounded uppercase mb-2 inline-block">
                Level 01
              </span>
              <p className="text-sm font-bold">Easy-to-follow recipes</p>
            </div>
          </div>

          {/* Card 2: Samantha Lia Testimonial Glass Card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-[#ECE5DB] relative min-h-[250px]">
            <div className="absolute top-5 right-5 text-[#FF5C2B]">
              <Heart className="fill-current" size={18} />
            </div>
            
            <div className="mt-8">
              <span className="text-4xl text-[#FF5C2B] font-serif leading-none">“</span>
              <p className="text-[0.95rem] text-[#111] font-medium leading-relaxed italic mb-4">
                Cooking has never been this easy!
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Samantha Lia"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h6 className="text-[11px] font-bold text-[#111]">Samantha Lia</h6>
                <p className="text-[9px] text-[#7A7269] uppercase font-semibold">Master Chef 2028</p>
              </div>
            </div>
          </div>

          {/* Card 3: Achievements and Live Info */}
          <div className="bg-[#111] text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg min-h-[250px]">
            <div className="space-y-4">
              {/* Stat 1 */}
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FF5C2B]">
                  <Trophy size={14} />
                </div>
                <div>
                  <span className="text-[9px] text-white/50 block font-semibold uppercase">Achievement</span>
                  <p className="text-xs font-bold">Cook 3 foods today</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                  <Radio size={14} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] text-white/50 block font-semibold uppercase">Live Now</span>
                  <p className="text-xs font-bold">Chef Mark Smith</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FF5C2B]">
                  <BookOpen size={14} />
                </div>
                <div>
                  <span className="text-[9px] text-white/50 block font-semibold uppercase">Today's Recipe</span>
                  <p className="text-xs font-bold text-[#FF5C2B]">Spaghetti Bolognese</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-white/60">
              <span>Next live at 6:00 PM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C2B]" />
            </div>
          </div>

          {/* Card 4: Cook with Master Chefs */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-900 group shadow-md">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&h=500&q=80"
              alt="Cook with master chefs"
              className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="fill-[#FF5C2B] stroke-[#FF5C2B]" />
                ))}
              </div>
              <p className="text-sm font-bold">Cook with Master Chefs</p>
            </div>
          </div>

        </div>

        {/* Curved Cooking Collage Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((url, index) => {
            // Apply alternating wave rounded corners for premium aesthetic matching the curves
            let roundedClass = "rounded-[2rem_2rem_0_0]"; // Default
            if (index % 2 === 1) {
              roundedClass = "rounded-[0_0_2rem_2rem] mt-6"; // Push odd down
            }
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`overflow-hidden aspect-[9/14] bg-[#111] shadow-lg ${roundedClass} group`}
              >
                <img
                  src={url}
                  alt={`Chef Cooking ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
