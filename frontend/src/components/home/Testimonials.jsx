import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const testimonials = [
  { name: 'Rajesh & Priya', role: 'Wedding Event', text: 'The food was excellent and all our guests were very happy. Everything was served on time and the team was very polite. Arunam Catering made our wedding day stress-free.' },
  { name: 'Prestige Group', role: 'Corporate Event', text: 'Very professional service and great taste. The menu was well planned and the food quality was top class. We received many compliments from our guests.' },
  { name: 'Sunil Kumar', role: 'Birthday Celebration', text: 'Clean service, fresh food, and good coordination. The team handled everything perfectly and the food taste was amazing. Highly recommended for any family function.' },
  { name: 'Meenakshi Sundaram', role: 'Housewarming Function', text: 'The food was very tasty and served hot. All items were prepared neatly and the service was well organized. Many guests asked for the caterer details.' },
  { name: 'HCL Technologies', role: 'Corporate Event', text: 'Arunam Catering handled our office event very smoothly. The food quantity was perfect and quality was excellent. On-time delivery and good coordination.' },
  { name: 'Anitha & Karthik', role: 'Baby Shower', text: 'The menu was well planned and the taste was amazing. Everything was clean and properly served. Very happy with the service and would surely book again.' },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent(c => (c + 1) % testimonials.length)

  return (
    <section className="py-20 md:py-28 overflow-hidden" style={{ background: '#181818' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow="Testimonials"
          title="Customer Feedback & Reviews"
          subtitle="See what our customers say about our food quality, service, and event execution"
          light
        />

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="text-center px-4"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FF5C2B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p
                className="text-[1.1rem] md:text-[1.2rem] font-light leading-[1.75] mb-8"
                style={{ color: 'rgba(255,255,255,0.72)', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}
              >
                "{testimonials[current].text}"
              </p>

              <div>
                <p
                  className="text-[0.88rem] font-semibold text-white"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {testimonials[current].name}
                </p>
                <p
                  className="text-[10.5px] tracking-wider mt-0.5"
                  style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
                >
                  {testimonials[current].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mt-10">
            <button
              onClick={prev}
              className="w-9 h-9 flex items-center justify-center transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C2B'; e.currentTarget.style.color = '#FF5C2B' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300"
                  style={{
                    height: 2,
                    width: i === current ? 28 : 8,
                    background: i === current ? '#FF5C2B' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-9 h-9 flex items-center justify-center transition-all duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C2B'; e.currentTarget.style.color = '#FF5C2B' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
              aria-label="Next"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 mt-16 gap-px"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {[
            { n: '100+', l: 'Events Catered' },
            { n: '5+', l: 'Years Experience' },
            { n: '300+', l: 'Min Guests' },
            { n: '4.5★', l: 'Google Rating' },
          ].map(({ n, l }) => (
            <div key={l} className="px-6 py-6 text-center" style={{ background: '#181818' }}>
              <p
                className="text-2xl font-semibold"
                style={{ color: '#FF5C2B', fontFamily: 'Playfair Display, serif' }}
              >
                {n}
              </p>
              <p
                className="text-[9.5px] tracking-[0.22em] uppercase mt-1"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}
              >
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
