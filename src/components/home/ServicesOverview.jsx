import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import ImagePlaceholder from '../ui/ImagePlaceholder'

const services = [
  { id: 'wedding',    title: 'Wedding Catering',       desc: 'Make your wedding day extra special with exquisite menu and elegant presentation.', tag: 'Popular', path: '/services/wedding' },
  { id: 'corporate', title: 'Corporate Catering',      desc: 'Impress clients and boost team morale with professional corporate catering solutions.', tag: null, path: '/services/corporate' },
  { id: 'engagement',title: 'Engagement Catering',     desc: 'Celebrate your love story with romantic and sophisticated catering arrangements.', tag: null, path: '/services/engagement' },
  { id: 'reception', title: 'Reception Catering',      desc: 'Create lasting impressions with grand reception catering for any occasion.',      tag: null, path: '/services/reception' },
  { id: 'birthday',  title: 'Birthday Party Catering',  desc: 'Make birthdays memorable with fun, festive, and delicious party catering.',       tag: null, path: '/services/birthday' },
  { id: 'babyshower',title: 'Baby Shower Catering',    desc: 'Welcome the little one with delightful treats and charming food displays.',            tag: null, path: '/services/baby-shower' },
]

function ServiceCard({ service, index }) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group relative flex flex-col overflow-hidden bg-white"
      style={{ border: '1px solid #E6DDD2' }}
    >
      {/* Image */}
      <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-[1.04]">
          <ImagePlaceholder label={service.title} aspectRatio="aspect-[4/3]" className="w-full h-full" />
        </div>
      </div>

      {service.tag && (
        <span
          className="absolute top-3.5 left-3.5 text-[8.5px] tracking-[0.22em] uppercase font-semibold px-2.5 py-1"
          style={{ background: '#FF5C2B', color: '#fff', fontFamily: 'Inter, sans-serif' }}
        >
          {service.tag}
        </span>
      )}

      <div className="flex flex-col flex-1 p-5">
        <h3
          className="text-[1.05rem] font-medium text-[#181818] mb-2 leading-snug"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {service.title}
        </h3>
        <p className="text-[0.83rem] text-[#6B6560] leading-[1.65] flex-1 mb-4">{service.desc}</p>
        <Link
          to={service.path}
          className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.18em] uppercase font-semibold transition-all duration-200"
          style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
        >
          Learn More <ArrowRight size={12} />
        </Link>
      </div>

      {/* Bottom gold bar on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] transition-transform duration-400 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ background: '#FF5C2B' }}
      />
    </motion.div>
  )
}

export default function ServicesOverview() {
  return (
    <section className="py-20 md:py-24" style={{ background: '#F8F4EE' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          eyebrow="Our Services"
          title="Catering for Every Occasion"
          subtitle="We provide delicious food, careful preparation, and reliable service to make every event memorable."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-3.5 transition-all duration-250"
            style={{ border: '1px solid #181818', color: '#181818' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#181818'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#181818' }}
          >
            View All Services <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  )
}
