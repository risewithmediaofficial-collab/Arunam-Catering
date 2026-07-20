import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import ImagePlaceholder from '../components/ui/ImagePlaceholder'

const services = [
  {
    id: 'wedding',
    title: 'Wedding Catering',
    eyebrow: 'Premium Service',
    desc: 'Chennai\'s most trusted wedding caterers. Authentic South Indian menus, elegant presentation, and flawless execution for your most important day.',
    highlights: ['South Indian multi-cuisine menus', 'Banana leaf & fine dining setups', 'Live cooking counters', 'Custom menu planning', '300–2000+ guests capacity', 'Experienced wedding team'],
    stats: [{ n: '5,000+', l: 'Weddings' }, { n: '4.9★', l: 'Rating' }],
    reverse: false,
  },
  {
    id: 'corporate',
    title: 'Corporate Catering',
    eyebrow: 'Professional Service',
    desc: 'Professional catering for corporate environments — from daily office meals to large-scale business events, delivered with punctuality and quality.',
    highlights: ['Office meetings & team lunches', 'Corporate event catering', 'Business celebrations', 'Veg and Non-Veg options', 'Customized quantity planning', 'On-time delivery guaranteed'],
    stats: [{ n: '500+', l: 'Corp. Events' }, { n: '100%', l: 'On Time' }],
    reverse: true,
  },
  {
    id: 'engagement',
    title: 'Engagement Catering',
    eyebrow: 'Traditional Service',
    desc: 'Mark your engagement with authentic South Indian flavours. Comprehensive menu planning and professional coordination for your ceremony.',
    highlights: ['Traditional ceremony menus', 'Family function specialists', 'Professional coordination', 'Custom menu creation', 'Local Chennai expertise', 'Smooth event management'],
    stats: [{ n: '1,000+', l: 'Engagements' }, { n: '25+', l: 'Years' }],
    reverse: false,
  },
  {
    id: 'babyshower',
    title: 'Baby Shower & Birthday',
    eyebrow: 'Celebration Service',
    desc: 'Customised menus and warm hospitality for baby showers, birthday parties, and every joyful milestone in between.',
    highlights: ['Themed menu options', 'Customized food stations', 'Dessert counters', 'Hygienic child-safe prep', 'Friendly serving staff', 'Flexible guest counts'],
    stats: [{ n: '800+', l: 'Celebrations' }, { n: '5★', l: 'Service' }],
    reverse: true,
  },
]

function ServiceSection({ service, i }) {
  return (
    <section
      key={service.id}
      className="py-20 md:py-24 overflow-hidden"
      style={{ background: i % 2 === 0 ? '#fff' : '#F8F4EE' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: service.reverse ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`relative ${service.reverse ? 'lg:order-2' : ''}`}
          >
            <div
              className="overflow-hidden"
              style={{ aspectRatio: '4/3', background: '#EDE5D8' }}
            >
              <ImagePlaceholder label={service.title} aspectRatio="aspect-[4/3]" className="w-full h-full" />
            </div>
            {/* Stats badge */}
            <div
              className="absolute bottom-0 right-0 md:-bottom-4 md:-right-4 flex"
              style={{ background: '#181818' }}
            >
              {service.stats.map(s => (
                <div
                  key={s.l}
                  className="px-5 py-4 text-center"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p
                    className="text-lg font-semibold leading-none"
                    style={{ color: '#FF5C2B', fontFamily: 'Playfair Display, serif' }}
                  >
                    {s.n}
                  </p>
                  <p
                    className="text-[9px] tracking-widest uppercase mt-1"
                    style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: service.reverse ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className={service.reverse ? 'lg:order-1' : ''}
          >
            <p
              className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-3"
              style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
            >
              {service.eyebrow}
            </p>
            <h2
              className="text-[1.85rem] lg:text-[2.2rem] font-medium text-[#181818] leading-[1.15] mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {service.title}
            </h2>
            <div className="mb-5" style={{ width: 32, height: 1, background: 'rgba(184,137,46,0.4)' }} />
            <p
              className="text-[0.88rem] leading-[1.7] mb-6"
              style={{ color: '#6B6560', fontFamily: 'Inter, sans-serif' }}
            >
              {service.desc}
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-7">
              {service.highlights.map(h => (
                <div key={h} className="flex items-start gap-2">
                  <Check size={12} className="mt-0.5 shrink-0" style={{ color: '#FF5C2B' }} />
                  <span
                    className="text-[0.82rem] text-[#6B6560]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {h}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.18em] uppercase font-semibold px-7 py-3.5 transition-all duration-250"
              style={{ background: '#181818', color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FF5C2B'}
              onMouseLeave={e => e.currentTarget.style.background = '#181818'}
            >
              Book This Service <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function Services() {
  return (
    <main>
      <PageHero
        eyebrow="Our Services"
        title="Catering for Every Celebration"
        subtitle="From intimate family functions to grand weddings — professional catering excellence across Chennai."
        bgLabel="Services Hero"
      />
      {services.map((service, i) => (
        <ServiceSection key={service.id} service={service} i={i} />
      ))}

      {/* Final CTA */}
      <section className="py-20" style={{ background: '#FF5C2B' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p
            className="text-[9.5px] tracking-[0.38em] uppercase mb-3"
            style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}
          >
            Let's Talk
          </p>
          <h2
            className="text-[1.8rem] lg:text-[2.2rem] font-medium text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Every Event Deserves Exceptional Catering
          </h2>
          <p
            className="text-[0.88rem] mb-7 max-w-md mx-auto"
            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}
          >
            Minimum 300 guests. Get in touch for a free consultation and quote.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-3.5 transition-all duration-250"
            style={{ background: '#fff', color: '#FF5C2B' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#181818'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#FF5C2B' }}
          >
            Get a Free Quote <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  )
}
