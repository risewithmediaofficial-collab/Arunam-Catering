import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Menu', path: '/menu' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-black/5'
            : 'bg-white/60 backdrop-blur-sm border-b border-black/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[76px]">

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/arunam_logo.png"
                alt="Arunam Catering Logo"
                className="h-14 md:h-[62px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-4.5">
              {navLinks.map((link) => {
                const active = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-[12px] tracking-wider uppercase font-semibold transition-all duration-300 flex items-center ${
                      active
                        ? 'bg-[#111111] text-white px-4.5 py-2.5 rounded-full gap-1.5 shadow-sm'
                        : 'text-[#111111]/70 hover:text-[#111111] px-3.5 py-2'
                    }`}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C2B]" />}
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Search Icon */}
              <button aria-label="Search" className="text-[#111]/75 hover:text-[#FF5C2B] transition-colors p-1.5">
                <Search size={18} />
              </button>

              {/* Call Icon */}
              <a
                href="tel:+918148784305"
                aria-label="Call Us"
                className="text-[#111]/75 hover:text-[#FF5C2B] transition-colors p-1.5"
              >
                <Phone size={18} />
              </a>

              {/* Book Catering CTA */}
              <Link
                to="/contact"
                className="text-[11px] tracking-[0.12em] uppercase font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-sm bg-[#FF5C2B] text-white hover:bg-[#E04618] hover:shadow-md hover:scale-[1.02]"
              >
                Book Catering
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-1.5 text-[#111] hover:text-[#FF5C2B] transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 z-40 bg-white shadow-lg border-b border-black/5 pt-[76px] pb-8 px-6 flex flex-col gap-6 lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm tracking-wide uppercase font-bold py-2.5 border-b border-black/5 flex items-center transition-all ${
                      active ? 'text-[#FF5C2B] pl-2' : 'text-[#111]/70'
                    }`}
                  >
                    {active && <span className="w-2 h-2 rounded-full bg-[#FF5C2B] mr-2" />}
                    {link.label}
                  </Link>
                )
              })}
            </nav>
            <div className="flex flex-col gap-4 mt-2">
              <a href="tel:+918148784305" className="flex items-center gap-3 text-sm text-[#111]/70 font-semibold py-2">
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#FF5C2B]">
                  <Phone size={14} />
                </div>
                <span>+91 81487 84305</span>
              </a>
              <Link
                to="/contact"
                className="block text-center text-[11px] tracking-[0.15em] uppercase font-bold py-3.5 rounded-full bg-[#FF5C2B] text-white hover:bg-[#E04618] shadow"
              >
                Book Catering
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

