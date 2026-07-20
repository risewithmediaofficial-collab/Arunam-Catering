import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqItems = [
  {
    q: "What type of cuisine do you offer?",
    a: "We specialise in a wide range of delicious cuisines including local favourites, traditional South Indian, North Indian, Chinese, Continental, and chef-crafted signature dishes made with fresh ingredients."
  },
  {
    q: "Do you offer home delivery or takeaway?",
    a: "Yes, for small parties or family gatherings we offer drop-off catering and takeaway services. For larger events, we offer full-service catering with live counters."
  },
  {
    q: "How can I make a reservation?",
    a: "You can click the 'Book Catering' button on our website, fill out the contact form, or call/WhatsApp us directly at +91 98848 89393 to discuss your event details."
  },
  {
    q: "Do you have vegetarian or vegan options?",
    a: "Yes, we offer fully customisable vegetarian and vegan menu options prepared in dedicated hygienic kitchens to respect dietary requirements."
  },
  {
    q: "What are your opening hours?",
    a: "Our catering support office is open from 9:00 AM to 9:00 PM every day. However, our event catering services operate 24/7 depending on your event needs."
  },
  {
    q: "Do you offer catering services for events?",
    a: "Absolutely! We cater for weddings, receptions, corporate events, engagements, birthday parties, baby showers, housewarmings, and family gatherings of all scales."
  },
  {
    q: "Are your ingredients fresh and hygienic?",
    a: "Yes! We source fresh vegetables daily from local organic farms and maintain the highest standards of hygiene and food safety in all our kitchens."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-20 md:py-24 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Chef Vector Graphic */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient glows */}
            <div className="absolute w-72 h-72 rounded-full bg-[#FF5C2B]/10 blur-[80px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-[360px] w-full"
            >
              <img
                src="/chef_cartoon_vector.png"
                alt="Cartoon Chef Illustration"
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(255,92,43,0.15)]"
              />
            </motion.div>
          </div>

          {/* Right Block: FAQ Accordion */}
          <div className="lg:col-span-7">
            <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#FF5C2B] mb-2 block">
              Any Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight mb-8">
              Frequently Asked <span className="text-[#FF5C2B]">Questions</span>
            </h2>

            <div className="space-y-3.5">
              {faqItems.map((item, idx) => {
                const isOpen = openIndex === idx
                return (
                  <div
                    key={idx}
                    className="border border-[#ECE5DB] rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-[#111] hover:text-[#FF5C2B] transition-colors"
                    >
                      <span>{item.q}</span>
                      <div className={`w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-[#111] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FF5C2B] bg-[#FF5C2B]/10' : ''}`}>
                        {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-5 pt-0 text-[13px] text-[#7A7269] leading-relaxed border-t border-[#ECE5DB]/60">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
