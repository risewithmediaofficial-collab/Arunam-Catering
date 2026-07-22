import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const eventTypes = [
  'Wedding','Reception','Engagement','Corporate Event',
  'Birthday Party','Baby Shower','Housewarming','Family Function','Other',
]

const inputCls = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.88rem',
  color: '#181818',
  background: '#fff',
  border: '1px solid #E6DDD2',
  padding: '0.75rem 1rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', guests:'', eventType:'', date:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = name => ({
    ...inputCls,
    borderColor: focused === name ? '#FF5C2B' : '#E6DDD2',
  })


  return (
    <main>
      <PageHero
        eyebrow="Contact Us"
        title="Let's Plan Your Event"
        subtitle="Reach out for a free consultation — we'll craft the perfect catering plan for your celebration."
        bgLabel="Contact Hero"
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">

            {/* Left info */}
            <div>
              <p
                className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-4"
                style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
              >
                Get in Touch
              </p>
              <h2
                className="text-[1.7rem] font-medium text-[#181818] leading-snug mb-8"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                We'd Love to Hear from You
              </h2>

              <div className="space-y-5">
                {[
                  { href: 'tel:+918148784305', Icon: Phone, label: 'Phone', value: '+91 81487 84305' },
                  { href: 'https://wa.me/918148784305', Icon: MessageCircle, label: 'WhatsApp', value: '+91 81487 84305', external: true },
                  { href: 'mailto:arunamcateringservice@gmail.com', Icon: Mail, label: 'Email', value: 'arunamcateringservice@gmail.com' },
                ].map(({ href, Icon, label, value, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-start gap-4 group"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:border-[#FF5C2B] group-hover:text-[#FF5C2B]"
                      style={{ border: '1px solid #E6DDD2', color: '#FF5C2B', background: '#F8F4EE' }}
                    >
                      <Icon size={15} />
                    </div>
                    <div>
                      <p
                        className="text-[9.5px] tracking-[0.22em] uppercase mb-0.5"
                        style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-[0.88rem] text-[#181818] break-all"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {value}
                      </p>
                    </div>
                  </a>
                ))}

                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ border: '1px solid #E6DDD2', color: '#FF5C2B', background: '#F8F4EE' }}
                  >
                    <MapPin size={15} />
                  </div>
                  <div>
                    <p className="text-[9.5px] tracking-[0.22em] uppercase mb-0.5" style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}>Address</p>
                    <address className="not-italic text-[0.88rem] text-[#181818] leading-[1.6]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Krishnagiri
                    </address>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ border: '1px solid #E6DDD2', color: '#FF5C2B', background: '#F8F4EE' }}
                  >
                    <Clock size={15} />
                  </div>
                  <div>
                    <p className="text-[9.5px] tracking-[0.22em] uppercase mb-0.5" style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}>Hours</p>
                    <p className="text-[0.88rem] text-[#181818]" style={{ fontFamily: 'Inter, sans-serif' }}>Mon – Sun: 9:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Min. requirement note */}
              <div
                className="mt-8 p-5"
                style={{ background: '#F8F4EE', borderLeft: '2px solid #FF5C2B' }}
              >
                <p className="text-[0.82rem] font-semibold text-[#181818] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Minimum Booking</p>
                <p className="text-[0.82rem] text-[#6B6560] leading-[1.6]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  We cater to events with a minimum of <strong>300 guests</strong>.
                </p>
              </div>
            </div>

            {/* Right form */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12"
                  style={{ border: '1px solid #E6DDD2', background: '#F8F4EE' }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-5"
                    style={{ background: '#FF5C2B' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium text-[#181818] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Thank You!</h3>
                  <p className="text-[0.88rem] text-[#6B6560] max-w-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    We've received your inquiry. Our team will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <p
                    className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-6"
                    style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
                  >
                    Booking Inquiry
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
                      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 XXXXX XXXXX', required: true },
                      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                      { id: 'guests', label: 'No. of Guests', type: 'number', placeholder: 'Min. 300', required: true, min: '300' },
                    ].map(f => (
                      <div key={f.id}>
                        <label
                          htmlFor={f.id}
                          className="block text-[9.5px] tracking-[0.22em] uppercase mb-1.5"
                          style={{ color: '#6B6560', fontFamily: 'Inter, sans-serif' }}
                        >
                          {f.label}{f.required && ' *'}
                        </label>
                        <input
                          id={f.id} name={f.id} type={f.type}
                          required={f.required} min={f.min}
                          value={form[f.id]} onChange={change}
                          placeholder={f.placeholder}
                          style={fieldStyle(f.id)}
                          onFocus={() => setFocused(f.id)}
                          onBlur={() => setFocused('')}
                        />
                      </div>
                    ))}

                    <div>
                      <label htmlFor="eventType" className="block text-[9.5px] tracking-[0.22em] uppercase mb-1.5" style={{ color: '#6B6560', fontFamily: 'Inter, sans-serif' }}>
                        Event Type *
                      </label>
                      <select
                        id="eventType" name="eventType" required
                        value={form.eventType} onChange={change}
                        style={{ ...fieldStyle('eventType'), appearance: 'none', cursor: 'pointer' }}
                        onFocus={() => setFocused('eventType')}
                        onBlur={() => setFocused('')}
                      >
                        <option value="" disabled>Select event type</option>
                        {eventTypes.map(et => <option key={et} value={et}>{et}</option>)}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-[9.5px] tracking-[0.22em] uppercase mb-1.5" style={{ color: '#6B6560', fontFamily: 'Inter, sans-serif' }}>
                        Event Date *
                      </label>
                      <input
                        id="date" name="date" type="date" required
                        value={form.date} onChange={change}
                        style={fieldStyle('date')}
                        onFocus={() => setFocused('date')}
                        onBlur={() => setFocused('')}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-[9.5px] tracking-[0.22em] uppercase mb-1.5" style={{ color: '#6B6560', fontFamily: 'Inter, sans-serif' }}>
                      Additional Requirements
                    </label>
                    <textarea
                      id="message" name="message" rows={4}
                      value={form.message} onChange={change}
                      placeholder="Tell us about your event, dietary needs, menu preferences..."
                      style={{ ...fieldStyle('message'), resize: 'none' }}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused('')}
                    />
                  </div>

                  {error && (
                    <p className="text-[0.82rem] text-red-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-3.5 transition-all duration-250"
                    style={{ background: submitting ? '#aaa' : '#FF5C2B', color: '#fff', fontFamily: 'Inter, sans-serif', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#E04618' }}
                    onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#FF5C2B' }}
                  >
                    <Send size={13} /> {submitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <div
        className="h-56 flex items-center justify-center"
        style={{ background: '#F0EAE0' }}
      >
        <div className="text-center">
          <MapPin size={28} style={{ color: '#FF5C2B', margin: '0 auto 10px' }} />
          <p className="text-[0.83rem] text-[#6B6560] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Krishnagiri
          </p>
          <a
            href="https://maps.google.com/?q=Krishnagiri"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10.5px] tracking-[0.2em] uppercase font-semibold pb-px"
            style={{ color: '#FF5C2B', borderBottom: '1px solid #FF5C2B', fontFamily: 'Inter, sans-serif' }}
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </main>
  )
}
