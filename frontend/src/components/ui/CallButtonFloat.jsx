import { useState, useRef, useEffect } from 'react'
import { Phone, X, User } from 'lucide-react'

export default function CallButtonFloat() {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef(null)

  // Close popover on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="fixed bottom-22 right-6 z-50 flex flex-col items-end" ref={popoverRef}>
      {/* Popover list of phone numbers */}
      {open && (
        <div
          className="mb-3 bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 w-72 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
          style={{
            boxShadow: '0 20px 35px -10px rgba(236, 72, 153, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-pink-600 flex items-center gap-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Phone size={12} className="animate-bounce" /> Call Us Directly
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Main Contact */}
            <a
              href="tel:+918148784305"
              className="flex items-center justify-between p-2.5 rounded-xl border border-pink-100 hover:border-pink-300 hover:bg-pink-50/60 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Primary Contact</p>
                  <p className="text-xs font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>+91 81487 84305</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider px-2 py-1 rounded bg-pink-100/60">Call</span>
            </a>

            {/* Chandrakala Contact */}
            <a
              href="tel:+919640708527"
              className="flex items-center justify-between p-2.5 rounded-xl border border-pink-100 hover:border-pink-300 hover:bg-pink-50/60 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Chandrakala</p>
                  <p className="text-xs font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>+91 96407 08527</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider px-2 py-1 rounded bg-rose-100/60">Call</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Highlighted Pink Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Call options"
        className="relative group w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-xl hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #FF2A7A 0%, #E91E63 100%)',
          boxShadow: '0 4px 20px rgba(233, 30, 99, 0.45)'
        }}
      >
        {/* Pulse effect rings */}
        <span className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-30" />
        
        {open ? (
          <X size={22} className="text-white relative z-10" />
        ) : (
          <Phone size={22} className="text-white relative z-10 animate-pulse" />
        )}
      </button>
    </div>
  )
}
