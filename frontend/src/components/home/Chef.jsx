import { motion } from 'framer-motion'
import { Users, CheckCircle2, Award, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { coupleDining } from '../../assets/images'

export default function Chef() {
  return (
    <section className="py-20 md:py-24 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Block: Gourmet Display Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-xl aspect-[4/5] bg-neutral-900">
              <img
                src={coupleDining}
                alt="Arunam Catering Wedding Celebration"
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Overlay Glass Card */}
              <div className="absolute bottom-6 inset-x-6 glass-panel-dark rounded-2xl p-5 text-white">
                <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#FF5C2B] block mb-1">
                  Arunam Catering
                </span>
                <h4 className="text-xl font-bold font-serif italic mb-2 text-white">
                  Crafted with Care
                </h4>
                <p className="text-[11px] text-white/70 leading-relaxed mb-4">
                  We accept catering orders for events with <br />
                  <span className="font-semibold text-white">a minimum of 300 guests.</span>
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] tracking-wider uppercase font-bold bg-[#FF5C2B] text-white px-4 py-2.5 rounded-full hover:bg-[#E04618] transition-all">
                  Book Now <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Block: About Us & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#FF5C2B] mb-2 block">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111] leading-tight mb-6">
              Crafted with Care. <span className="text-[#FF5C2B]">Served with Pride</span>
            </h2>
            <div className="space-y-4 text-[0.92rem] text-[#7A7269] leading-relaxed mb-8 max-w-xl">
              <p>
                From family functions to big weddings and corporate events, we take care of everything so you and your guests can enjoy the occasion without worry.
              </p>
              <p>
                At Arunam Catering, we believe good food makes every celebration better. We are a Chennai-based catering service offering tasty, high-quality food with friendly and reliable service for all kinds of events.
              </p>
            </div>

            {/* Stats Grid - 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stat 1 */}
              <motion.div
                whileHover={{ y: -3 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ECE5DB]/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF5C2B]/10 flex items-center justify-center text-[#FF5C2B] shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <h5 className="text-[14px] font-bold text-[#111]">25K+</h5>
                  <p className="text-[10.5px] text-[#7A7269]">Happy Families</p>
                </div>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                whileHover={{ y: -3 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ECE5DB]/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF5C2B]/10 flex items-center justify-center text-[#FF5C2B] shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h5 className="text-[14px] font-bold text-[#111]">3K+</h5>
                  <p className="text-[10.5px] text-[#7A7269]">Events Completed</p>
                </div>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                whileHover={{ y: -3 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ECE5DB]/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF5C2B]/10 flex items-center justify-center text-[#FF5C2B] shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <h5 className="text-[14px] font-bold text-[#111]">50+</h5>
                  <p className="text-[10.5px] text-[#7A7269]">Expert Teams</p>
                </div>
              </motion.div>

              {/* Stat 4 */}
              <motion.div
                whileHover={{ y: -3 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ECE5DB]/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF5C2B]/10 flex items-center justify-center text-[#FF5C2B] shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h5 className="text-[14px] font-bold text-[#111]">25+ Years</h5>
                  <p className="text-[10.5px] text-[#7A7269]">Of Experience</p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
