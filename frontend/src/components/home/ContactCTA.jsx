import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Phone, MessageCircle } from 'lucide-react'
import ImagePlaceholder from '../ui/ImagePlaceholder'

export default function ContactCTA() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })
  return (
    <section className="py-20 md:py-24" style={{ background: '#F8F4EE' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
          style={{ border: '1px solid #E6DDD2' }}
        >
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="hidden lg:block relative min-h-[440px]"
          >
            <ImagePlaceholder label="Grand Wedding Setup" className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,transparent 60%,#F8F4EE)' }} />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="p-9 lg:p-14 flex flex-col justify-center bg-white"
          >
            <p
              className="text-[10px] tracking-[0.42em] uppercase font-semibold mb-4"
              style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
            >
              Book Your Event
            </p>
            <h2
              className="text-[1.85rem] lg:text-[2.1rem] font-medium text-[#181818] leading-[1.18] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Ready to Plan Your Perfect Celebration?
            </h2>
            <div className="w-10 h-px mb-5" style={{ background: 'rgba(184,137,46,0.4)' }} />
            <p
              className="text-[0.88rem] leading-[1.7] mb-7"
              style={{ color: '#6B6560', fontFamily: 'Inter, sans-serif' }}
            >
              Get in touch to discuss your event requirements. We handle celebrations of
              300+ guests across Chennai with professionalism and culinary excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <a
                href="tel:+919884889393"
                className="flex items-center justify-center gap-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold px-7 py-3.5 transition-all duration-250"
                style={{ background: '#181818', color: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FF5C2B'}
                onMouseLeave={e => e.currentTarget.style.background = '#181818'}
              >
                <Phone size={13} /> Call Us
              </a>
              <a
                href="https://wa.me/919884889393"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold px-7 py-3.5 transition-all duration-250"
                style={{ border: '1px solid #FF5C2B', color: '#FF5C2B' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FF5C2B'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF5C2B' }}
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </div>

            <Link
              to="/contact"
              className="self-start text-[11px] tracking-[0.18em] uppercase font-semibold pb-px transition-colors duration-200"
              style={{ color: '#6B6560', borderBottom: '1px solid #E6DDD2' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF5C2B'; e.currentTarget.style.borderBottomColor = '#FF5C2B' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6B6560'; e.currentTarget.style.borderBottomColor = '#E6DDD2' }}
            >
              Fill Booking Form →
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-7 pt-7" style={{ borderTop: '1px solid #F0EAE0' }}>
              {['Min. 300 Guests', 'Custom Menus', 'Free Quote', 'Chennai Based'].map(tag => (
                <span
                  key={tag}
                  className="text-[9.5px] tracking-[0.18em] uppercase px-3 py-1.5"
                  style={{ border: '1px solid #E6DDD2', color: '#6B6560', fontFamily: 'Inter, sans-serif' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
