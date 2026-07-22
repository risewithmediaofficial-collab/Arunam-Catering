import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle, Lock } from 'lucide-react'

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)
const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
  </svg>
)

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Menu', path: '/menu' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Contact', path: '/contact' },
]

const serviceList = [
  'Wedding Catering', 'Corporate Catering', 'Engagement Catering',
  'Reception Catering', 'Birthday Catering', 'Baby Shower Catering',
  'Housewarming', 'Family Functions',
]

export default function Footer() {
  return (
    <footer style={{ background: '#F3EDE2', borderTop: '1px solid #ECE5DB' }}>
      {/* CTA Band */}
      <div className="relative overflow-hidden" style={{ background: '#FF5C2B' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src="/chef_cartoon_vector.png"
              alt="Arunam Cartoon Chef Mascot"
              className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0 filter drop-shadow-lg"
            />
            <div>
              <p
                className="text-[9.5px] tracking-[0.35em] uppercase mb-1"
                style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif' }}
              >
                Ready to plan your event?
              </p>
              <h3
                className="text-xl lg:text-2xl text-white font-semibold"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Let's Create Something Memorable
              </h3>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://wa.me/918148784305"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
              style={{ background: '#fff', color: '#FF5C2B' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#FF5C2B' }}
            >
              <MessageCircle size={13} /> WhatsApp Us
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-bold px-6 py-3 rounded-full transition-all duration-300 border"
              style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="/arunam_logo.png"
                alt="Arunam Catering Logo"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
            <p
              className="text-[0.83rem] leading-[1.65] mb-5 text-[#7A7269]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Exceptional catering for unforgettable celebrations. Serving you with authentic cuisines and culinary excellence.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: InstagramIcon, href: 'https://www.instagram.com/arunam_catering?igsh=ZmdhMHpleDV3b29z', label: 'Instagram', external: true },
                { Icon: FacebookIcon, href: 'https://www.facebook.com/profile.php?id=61591964292284', label: 'Facebook', external: true },
                { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid #ECE5DB', color: '#7A7269' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C2B'; e.currentTarget.style.color = '#FF5C2B' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ECE5DB'; e.currentTarget.style.color = '#7A7269' }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-[9.5px] tracking-[0.3em] uppercase font-bold mb-5"
              style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[0.83rem] transition-colors duration-200 flex items-center gap-2 group text-[#7A7269]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#111111'}
                    onMouseLeave={e => e.currentTarget.style.color = '#7A7269'}
                  >
                    <span
                      className="w-3 h-px transition-all duration-250 group-hover:w-5 bg-[#7A7269]/40"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-[9.5px] tracking-[0.3em] uppercase font-bold mb-5"
              style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
            >
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {serviceList.map(s => (
                <li key={s}>
                  <span
                    className="text-[0.83rem] flex items-center gap-2 text-[#7A7269]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <span className="w-3 h-px bg-[#ECE5DB]" />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[9.5px] tracking-[0.3em] uppercase font-bold mb-5"
              style={{ color: '#FF5C2B', fontFamily: 'Inter, sans-serif' }}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              {[
                { href: 'tel:+918148784305', Icon: Phone, text: '+91 81487 84305' },
                { href: 'https://wa.me/918148784305', Icon: MessageCircle, text: 'WhatsApp: +91 81487 84305', external: true },
                { href: 'mailto:arunamcateringservice@gmail.com', Icon: Mail, text: 'arunamcateringservice@gmail.com' },
              ].map(({ href, Icon, text, external }) => (
                <li key={text}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-start gap-3 text-[0.83rem] transition-colors duration-200 text-[#7A7269]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#111111'}
                    onMouseLeave={e => e.currentTarget.style.color = '#7A7269'}
                  >
                    <Icon size={13} className="mt-0.5 shrink-0" style={{ color: '#FF5C2B' }} />
                    <span>{text}</span>
                  </a>
                </li>
              ))}
              <li>
                <div className="flex items-start gap-3 text-[0.83rem] text-[#7A7269]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <MapPin size={13} className="mt-0.5 shrink-0" style={{ color: '#FF5C2B' }} />
                  <address className="not-italic leading-[1.6]">
                    Krishnagiri
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #ECE5DB' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="text-[11px] text-[#7A7269] flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span>© {new Date().getFullYear()} Arunam Catering. All rights reserved.</span>
            <span className="hidden sm:inline text-[#ECE5DB]">•</span>
            <span>Developed and Designed with <span className="font-semibold text-[#111]">Rise With Media</span></span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[
              { label: 'Privacy Policy', path: '/privacy-policy' },
              { label: 'Terms & Conditions', path: '/terms' },
            ].map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[11px] transition-colors duration-200 text-[#7A7269]/80 hover:text-[#111]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-full border border-[#FF5C2B]/30 text-[#FF5C2B] hover:bg-[#FF5C2B] hover:text-white transition-all duration-200 shadow-xs"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Lock size={11} /> Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
