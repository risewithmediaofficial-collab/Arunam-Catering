import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import SectionHeading from '../components/ui/SectionHeading'

const testimonials = [
  { name: 'Priya Ramachandran', role: 'Bride, Wedding 2024', text: 'Arunam Catering made our wedding day absolutely perfect. Every guest complimented the quality and freshness. Professional staff and elegant presentation throughout.' },
  { name: 'Karthik Subramaniam', role: 'Corporate Event Manager', text: 'We\'ve used Arunam Catering for all our corporate events in Tamilnadu for 3 years. On-time delivery, hygienic preparation, and professional service — truly unmatched.' },
  { name: 'Deepa Murugan', role: 'Mother, Baby Shower', text: 'The customised menu for our daughter\'s baby shower was beyond expectations. Fresh ingredients, beautiful presentation, and the staff were warm and friendly.' },
  { name: 'Rajesh Venkataraman', role: 'Family Function Host', text: '500+ guests and Arunam Catering handled everything seamlessly. Food was delicious, served hot and on time. The team\'s coordination was absolutely exceptional.' },
  { name: 'Anitha Krishnamoorthy', role: 'Bride\'s Mother, Reception', text: 'Excellent food and professional service from start to finish. The authentic South Indian spread was flavourful and well-presented. Guests are still talking about it!' },
  { name: 'Suresh Balakrishnan', role: 'Corporate HR Manager', text: 'Best catering in Tamilnadu for corporate events. Punctual, professional, consistently excellent food quality. Highly recommended for any business event.' },
  { name: 'Meena Sundaram', role: 'Mother of Bride', text: 'From initial planning to the last plate served, Arunam Catering exceeded every expectation. The banana leaf lunch spread was the highlight of our reception.' },
  { name: 'Arun Selvam', role: 'Event Organizer', text: 'I\'ve worked with many caterers but Arunam Catering stands apart. Managing 800+ guest events without hiccups is a testament to their experience and expertise.' },
  { name: 'Kavitha Rajan', role: 'Birthday Party Host', text: 'Wonderful service for our daughter\'s birthday. Fresh food, generous portions, and very helpful staff throughout. We\'ll definitely book them again.' },
]

export default function Testimonials() {
  return (
    <main>
      <PageHero
        eyebrow="Testimonials"
        title="Trusted by Thousands"
        subtitle="Over 3,333 Google reviews. Here's what our clients say."
        bgLabel="Testimonials Hero"
      />

      {/* Stats band */}
      <section className="py-12" style={{ background: '#FF5C2B' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { n: '3,333+', l: 'Google Reviews' },
              { n: '4.9★', l: 'Average Rating' },
              { n: '25K+', l: 'Happy Families' },
              { n: '5,000+', l: 'Weddings Catered' },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="text-[1.8rem] font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{n}</p>
                <p className="text-[9.5px] tracking-[0.25em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 md:py-24" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeading
            eyebrow="Client Stories"
            title="What Our Clients Say"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="bg-white p-7 flex flex-col"
                style={{ border: '1px solid #E6DDD2' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="#FF5C2B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p
                  className="text-[0.86rem] text-[#6B6560] leading-[1.7] flex-1 mb-5 italic"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  "{t.text}"
                </p>
                <div style={{ borderTop: '1px solid #F0EAE0', paddingTop: '1rem' }}>
                  <p className="text-[0.88rem] font-semibold text-[#181818]" style={{ fontFamily: 'Inter, sans-serif' }}>{t.name}</p>
                  <p className="text-[10px] tracking-wider mt-0.5" style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
