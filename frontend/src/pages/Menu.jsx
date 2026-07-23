import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, Search, Calendar, Users, Phone, Utensils, Send, ChevronRight } from 'lucide-react'
import PageHero from '../components/layout/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import {
  dosaBananaleaf,
  bananaLeafSpread,
  drumstickCurryRice,
  guestsFeast,
  livePaanStall
} from '../assets/images'
import { TIFFIN_MENUS, LUNCH_MENUS, DINNER_MENUS, SMART_CHOICE_MENUS, CATEGORY_MENUS } from '../admin/presetMenus'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const categoryCards = [
  {
    id: 'breakfast',
    title: 'Breakfast Menus',
    label: 'Breakfast',
    desc: 'Fresh and flavorful breakfast options to start the day right. 20 predefined Tiffin packages.',
    img: dosaBananaleaf,
    data: TIFFIN_MENUS,
    count: Object.keys(TIFFIN_MENUS).length + ' Packages',
  },
  {
    id: 'lunch',
    title: 'Lunch Menus',
    label: 'Lunch',
    desc: 'Rich, wholesome, and fulfilling meals with authentic South Indian taste. 20 traditional Lunch packages.',
    img: bananaLeafSpread,
    data: LUNCH_MENUS,
    count: Object.keys(LUNCH_MENUS).length + ' Packages',
  },
  {
    id: 'dinner',
    title: 'Dinner Menus',
    label: 'Dinner',
    desc: 'Crafted to impress with variety and elegant presentation. 26 comprehensive Dinner spreads.',
    img: drumstickCurryRice,
    data: DINNER_MENUS,
    count: Object.keys(DINNER_MENUS).length + ' Packages',
  },
  {
    id: 'smart',
    title: 'Smart Choice Menus',
    label: 'Smart Choice',
    desc: 'Thoughtfully designed for balanced taste and value. Perfect for large scale gatherings.',
    img: guestsFeast,
    data: SMART_CHOICE_MENUS,
    count: Object.keys(SMART_CHOICE_MENUS).length + ' Packages',
  },
  {
    id: 'custom',
    title: 'Customizable & Variety Menus',
    label: 'Category Varieties',
    desc: 'Professional catering featuring custom sweets, starters, sabzi, halwa, payasam & regional specials.',
    img: livePaanStall,
    data: CATEGORY_MENUS,
    count: Object.keys(CATEGORY_MENUS).length + ' Categories',
  },
]

export default function Menu() {
  const navigate = useNavigate()
  // viewMode: 'overview' (Tier 1) | 'detail' (Tier 2)
  const [viewMode, setViewMode] = useState('overview')
  const [selectedCatId, setSelectedCatId] = useState('breakfast')
  const [searchQuery, setSearchQuery] = useState('')

  // Sidebar Proposal Form State
  const [propForm, setPropForm] = useState({
    name: '',
    phone: '',
    guests: '300',
    date: '',
    eventType: 'Wedding',
    selectedPackage: '',
    message: ''
  })
  const [propSubmitting, setPropSubmitting] = useState(false)
  const [propSuccess, setPropSuccess] = useState(false)
  const [propError, setPropError] = useState('')

  const activeCategoryObj = categoryCards.find(c => c.id === selectedCatId) || categoryCards[0]

  const handleOpenCategory = (catId) => {
    setSelectedCatId(catId)
    setViewMode('detail')
    setSearchQuery('')
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleProposalSubmit = async (e) => {
    e.preventDefault()
    setPropSubmitting(true)
    setPropError('')
    setPropSuccess(false)

    try {
      const payload = {
        name: propForm.name,
        phone: propForm.phone,
        guests: propForm.guests,
        date: propForm.date,
        eventType: propForm.eventType,
        menuCategory: activeCategoryObj.label,
        menuPackage: propForm.selectedPackage || (viewMode === 'detail' ? `${activeCategoryObj.label} General` : 'General Inquiry'),
        message: propForm.message || `Catering proposal request for ${activeCategoryObj.title}`
      }

      const res = await fetch(`${API}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Submission failed')
      setPropSuccess(true)
      setPropForm({ name: '', phone: '', guests: '300', date: '', eventType: 'Wedding', selectedPackage: '', message: '' })
    } catch {
      setPropError('Failed to send enquiry. Please call +91 81487 84305 directly.')
    } finally {
      setPropSubmitting(false)
    }
  }

  // Filter package options for detail view
  const filteredPackages = useMemo(() => {
    if (!activeCategoryObj || !activeCategoryObj.data) return []
    const entries = Object.entries(activeCategoryObj.data)
    if (!searchQuery.trim()) return entries

    const q = searchQuery.toLowerCase()
    return entries.filter(([pkgName, items]) => {
      if (pkgName.toLowerCase().includes(q)) return true
      return items.some(item => item.toLowerCase().includes(q))
    })
  }, [activeCategoryObj, searchQuery])

  return (
    <main className="bg-[#FAF7F2] min-h-screen">
      <PageHero
        eyebrow="Our Catering Menus"
        title="Crafted for Every Palate"
        subtitle="Authentic South Indian cuisine with multi-cuisine options for every event, grand celebration, and every guest."
        bgLabel="Menu Hero"
      />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Tier 1 Header & Category Selector Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5C2B]" />
                <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#FF5C2B]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {viewMode === 'overview' ? 'Menu Overview' : 'Sub-Menu Selection'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#181818]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {viewMode === 'overview' ? 'Explore Our Catering Packages' : activeCategoryObj.title}
              </h2>
            </div>

            {viewMode === 'detail' && (
              <button
                onClick={() => setViewMode('overview')}
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded-full border border-[#E6DDD2] bg-white text-[#181818] hover:bg-[#FF5C2B] hover:text-white transition-all shadow-sm self-start md:self-auto"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <ArrowLeft size={14} /> Back to All Categories
              </button>
            )}
          </div>

          {/* Quick Category Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-[#E6DDD2] pb-4">
            {categoryCards.map(cat => {
              const active = selectedCatId === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCatId(cat.id)
                    // If in overview mode, clicking tab keeps overview or opens detail
                  }}
                  className={`text-[11px] tracking-[0.16em] uppercase font-bold px-5 py-2.5 rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-[#181818] text-white shadow-md'
                      : 'bg-white text-[#6B6560] hover:text-[#181818] border border-[#E6DDD2]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* TIER 1: OVERVIEW VIEW (Category Cards + Proposal Widget) */}
          {viewMode === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
              
              {/* Left: Category Cards (Image 1 Style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categoryCards.map(cat => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-[#E6DDD2] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-52 overflow-hidden bg-neutral-900">
                      <img
                        src={cat.img}
                        alt={cat.title}
                        className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute top-4 right-4 bg-white/95 text-[#181818] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {cat.count}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#181818] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {cat.title}
                        </h3>
                        <p className="text-xs text-[#6B6560] leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {cat.desc}
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenCategory(cat.id)}
                        className="w-full inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold py-3 rounded-xl border border-[#FF5C2B] text-[#FF5C2B] hover:bg-[#FF5C2B] hover:text-white transition-all shadow-xs group/btn"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        View Items <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right: Request Catering Proposal Sidebar (Matching Image 1 Right Side) */}
              <div className="sticky top-28 bg-white rounded-2xl border border-[#E6DDD2] p-6 shadow-md">
                <div className="border-b border-gray-100 pb-4 mb-5">
                  <h3 className="text-xl font-bold text-[#181818] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Request Catering Proposal
                  </h3>
                  <p className="text-xs text-[#6B6560]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Serving large-scale events with professional planning and quality food.
                  </p>
                </div>

                {propSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-5 text-center">
                    <Check size={28} className="mx-auto mb-2 text-emerald-600" />
                    <h4 className="font-bold text-sm mb-1">Proposal Request Sent!</h4>
                    <p className="text-xs">We will contact you shortly with custom menu pricing.</p>
                    <button
                      onClick={() => setPropSuccess(false)}
                      className="mt-4 text-[11px] uppercase font-bold text-emerald-700 underline"
                    >
                      Send Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={propForm.name}
                        onChange={e => setPropForm({ ...propForm, name: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#E6DDD2] rounded-xl px-4 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#FF5C2B]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Enter 10-digit number"
                        value={propForm.phone}
                        onChange={e => setPropForm({ ...propForm, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#E6DDD2] rounded-xl px-4 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#FF5C2B]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <input
                        type="number"
                        min="300"
                        required
                        placeholder="Minimum 300 guests"
                        value={propForm.guests}
                        onChange={e => setPropForm({ ...propForm, guests: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#E6DDD2] rounded-xl px-4 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#FF5C2B]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <input
                        type="date"
                        required
                        value={propForm.date}
                        onChange={e => setPropForm({ ...propForm, date: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#E6DDD2] rounded-xl px-4 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#FF5C2B]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <select
                        value={propForm.eventType}
                        onChange={e => setPropForm({ ...propForm, eventType: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#E6DDD2] rounded-xl px-4 py-2.5 text-xs text-[#181818] focus:outline-none focus:border-[#FF5C2B]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <option value="Engagement">Engagement</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Reception">Reception</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Ear Piercing">Ear Piercing</option>
                        <option value="Puberty">Puberty</option>
                        <option value="Housewarming">Housewarming</option>
                        <option value="Family Function">Family Function</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {propError && (
                      <p className="text-[11px] text-red-500 text-center">{propError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={propSubmitting}
                      className="w-full bg-[#FF5C2B] hover:bg-[#E04618] text-white text-xs uppercase font-bold tracking-wider py-3.5 rounded-xl transition-all shadow-md"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {propSubmitting ? 'Sending Request...' : 'Book Your Event'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* TIER 2: DETAILED SUB-MENUS VIEW (Matching Image 2 Style) */}
          {viewMode === 'detail' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
              
              {/* Left Sub-Menu Cards */}
              <div className="space-y-6">
                
                {/* Search & Sub-category Filter Bar */}
                <div className="bg-white rounded-2xl border border-[#E6DDD2] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Search in ${activeCategoryObj.label}...`}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E6DDD2] rounded-xl pl-9 pr-4 py-2 text-xs text-[#181818] focus:outline-none focus:border-[#FF5C2B]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>

                  <p className="text-xs text-[#6B6560] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Showing <strong className="text-[#181818]">{filteredPackages.length}</strong> menu option(s)
                  </p>
                </div>

                {/* Grid of Menu Package Cards (Matching Image 2 Dark/Gold Luxury Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map(([pkgName, items]) => (
                    <motion.div
                      key={pkgName}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#0D1527] text-white rounded-2xl p-6 border border-amber-500/20 shadow-xl flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 group"
                    >
                      <div>
                        {/* Package Header */}
                        <div className="border-b border-white/10 pb-3 mb-4 flex items-center justify-between">
                          <h4 className="text-lg font-bold text-amber-400 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {pkgName}
                          </h4>
                          <span className="text-[10px] text-amber-200/60 uppercase font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                            {items.length} Items
                          </span>
                        </div>

                        {/* Dish Items List (Numbered like Image 2) */}
                        <ul className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-1 text-xs text-gray-200 scrollbar-thin">
                          {items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => navigate(`/contact?category=${encodeURIComponent(activeCategoryObj.key || activeCategoryObj.label)}&package=${encodeURIComponent(pkgName)}`)}
                        className="w-full bg-[#FF5C2B] hover:bg-[#E04618] text-white text-[11px] uppercase font-bold tracking-wider py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 mt-auto"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Select & Book {pkgName} <ChevronRight size={13} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {filteredPackages.length === 0 && (
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#E6DDD2] text-gray-500">
                    <Utensils size={36} className="mx-auto mb-3 opacity-30 text-[#FF5C2B]" />
                    <p className="text-sm font-medium">No menu packages found matching "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-xs font-bold text-[#FF5C2B] uppercase tracking-wider underline"
                    >
                      Clear Search Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side Quote Form (Matching Image 2 Right Side) */}
              <div className="sticky top-28 bg-[#0D1527] text-white rounded-2xl p-6 border border-amber-500/20 shadow-2xl">
                <div className="border-b border-white/10 pb-4 mb-5">
                  <h3 className="text-xl font-bold text-amber-400 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Get Catering Quote
                  </h3>
                  <p className="text-[11px] text-gray-300 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>Please note:</strong> We accept catering orders for a minimum of <strong>300 guests</strong>.
                  </p>
                </div>

                {propSuccess ? (
                  <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 rounded-xl p-5 text-center">
                    <Check size={28} className="mx-auto mb-2 text-emerald-400" />
                    <h4 className="font-bold text-sm mb-1">Quote Request Received!</h4>
                    <p className="text-xs text-gray-300">We will reach out with complete menu package details.</p>
                    <button
                      onClick={() => setPropSuccess(false)}
                      className="mt-4 text-[11px] uppercase font-bold text-emerald-400 underline"
                    >
                      Request Another Quote
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProposalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={propForm.name}
                        onChange={e => setPropForm({ ...propForm, name: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter 10-digit number"
                        value={propForm.phone}
                        onChange={e => setPropForm({ ...propForm, phone: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Guests Count</label>
                      <input
                        type="number"
                        min="300"
                        required
                        placeholder="Minimum 300 guests"
                        value={propForm.guests}
                        onChange={e => setPropForm({ ...propForm, guests: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Select Specific Menu Package</label>
                      <select
                        value={propForm.selectedPackage}
                        onChange={e => setPropForm({ ...propForm, selectedPackage: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <option value="" className="bg-[#0D1527] text-white">-- Select Package --</option>
                        {filteredPackages.map(([pkg]) => (
                          <option key={pkg} value={pkg} className="bg-[#0D1527] text-white">{pkg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-1">Message / Event Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Mention event type or dietary requests..."
                        value={propForm.message}
                        onChange={e => setPropForm({ ...propForm, message: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {propError && (
                      <p className="text-[11px] text-red-400 text-center">{propError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={propSubmitting}
                      className="w-full bg-gradient-to-r from-[#FF5C2B] to-[#E04618] hover:from-[#E04618] hover:to-[#C83408] text-white text-xs uppercase font-bold tracking-wider py-3.5 rounded-xl transition-all shadow-lg"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {propSubmitting ? 'Submitting...' : 'Book Now'}
                    </button>

                    <p className="text-[10px] text-center text-gray-400 mt-2">
                      Make your event grand with our 300+ guest catering service.
                    </p>
                  </form>
                )}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16" style={{ background: '#181818' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[9.5px] tracking-[0.38em] uppercase mb-3" style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}>Custom Planning</p>
          <h2 className="text-[1.8rem] font-medium text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Can't find the perfect menu?</h2>
          <p className="text-[0.88rem] mb-7" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>We'll build one just for you. Contact us for a free menu consultation.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-9 py-3.5 transition-all duration-250"
            style={{ background: '#FF5C2B', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E04618'}
            onMouseLeave={e => e.currentTarget.style.background = '#FF5C2B'}
          >
            Plan Your Menu <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  )
}
