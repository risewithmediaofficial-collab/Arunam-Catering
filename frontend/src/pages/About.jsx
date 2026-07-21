import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import PageHero from '../components/layout/PageHero'
import { chefsServing, serviceTeamInAction, yellowDiningHall } from '../assets/images'

const values = [
  { title: 'Authenticity', desc: 'Traditional South Indian recipes passed down through generations.' },
  { title: 'Hygiene', desc: 'Highest food safety standards in every kitchen we operate.' },
  { title: 'Professionalism', desc: 'From planning to plating, executed with precision and care.' },
  { title: 'Community', desc: 'Chennai\'s own — rooted in local culture for 25+ years.' },
]

const events = [
  'Wedding','Reception','Engagement','Corporate Events',
  'Birthday Party','Baby Shower','Housewarming','Family Functions',
  'Office Functions','Traditional Celebrations',
]

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })

  return (
    <main>
      <PageHero
        eyebrow="Our Story"
        title="25 Years of Culinary Excellence"
        subtitle="A journey of passion, tradition, and exceptional service across Chennai."
        bgLabel="About Hero"
      />

      {/* Story */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <div ref={ref}>
              <SectionHeading
                eyebrow="Who We Are"
                title="Chennai's Most Trusted Catering Partner"
                align="left"
              />
              <div
                className="space-y-4 text-[0.88rem] text-[#6B6560] leading-[1.75] mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <p>
                  Arunam Catering Service was born from a simple passion — to bring authentic,
                  high-quality food to the most important moments in people's lives. From a small
                  family operation, we have grown into one of Chennai's most trusted catering brands.
                </p>
                <p>
                  With over 25 years of experience and 5,000+ weddings catered, we understand
                  every event is unique. Our professional chefs, trained staff, and dedicated
                  coordinators ensure your celebration is nothing short of perfect.
                </p>
                <p>
                  We specialise in events of 300+ guests — weddings, corporate gatherings,
                  engagements, receptions, birthdays, baby showers, and more.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {values.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ borderLeft: '2px solid #FF5C2B', paddingLeft: '1rem' }}
                  >
                    <h4
                      className="text-[0.88rem] font-semibold text-[#181818] mb-1"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {v.title}
                    </h4>
                    <p
                      className="text-[0.82rem] text-[#6B6560] leading-[1.6]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {v.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-7 py-3.5 transition-all duration-250"
                style={{ background: '#FF5C2B', color: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.background = '#E04618'}
                onMouseLeave={e => e.currentTarget.style.background = '#FF5C2B'}
              >
                Get in Touch <ArrowRight size={12} />
              </Link>
            </div>

            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-2xl shadow-md" style={{ aspectRatio: '3/4' }}>
                  <img src={chefsServing} alt="Our Kitchen & Chef Team" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3 mt-10">
                  <div className="overflow-hidden rounded-2xl shadow-md" style={{ aspectRatio: '4/3' }}>
                    <img src={serviceTeamInAction} alt="Our Service Team" className="w-full h-full object-cover" />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-md" style={{ aspectRatio: '1/1' }}>
                    <img src={yellowDiningHall} alt="Grand Event Setup" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 md:-bottom-4 md:-left-4 p-5 text-center"
                style={{ background: '#FF5C2B' }}
              >
                <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>25+</p>
                <p className="text-[9px] tracking-[0.2em] uppercase mt-0.5 text-white/80">Years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14" style={{ background: '#181818' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div
            className="grid grid-cols-2 lg:grid-cols-5 gap-px"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            {[
              { n: '25K+', l: 'Happy Families' },
              { n: '3K+', l: 'Events Done' },
              { n: '5K+', l: 'Weddings' },
              { n: '50+', l: 'Expert Staff' },
              { n: '4.9★', l: 'Google Rating' },
            ].map(({ n, l }) => (
              <div key={l} className="py-8 text-center" style={{ background: '#181818' }}>
                <p className="text-[1.8rem] font-semibold" style={{ color: '#FF5C2B', fontFamily: 'Playfair Display, serif' }}>{n}</p>
                <p className="text-[9.5px] tracking-[0.22em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event types */}
      <section className="py-20 md:py-24" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeading
            eyebrow="Event Coverage"
            title="Every Celebration, Expertly Catered"
            subtitle="Our culinary expertise spans a wide range of events across Chennai."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {events.map((event, i) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="py-5 px-4 text-center transition-all duration-200 group cursor-default"
                style={{ border: '1px solid #E6DDD2', background: '#fff' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C2B'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E6DDD2'; }}
              >
                <p
                  className="text-[11px] tracking-wider text-[#6B6560]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {event}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
