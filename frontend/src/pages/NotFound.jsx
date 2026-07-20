import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 pt-20"
      style={{ background: '#F8F4EE' }}
    >
      <div className="text-center max-w-md">
        <p
          className="font-semibold leading-none mb-0"
          style={{ fontSize: 120, color: 'rgba(184,137,46,0.12)', fontFamily: 'Playfair Display, serif' }}
        >
          404
        </p>
        <h1
          className="text-3xl font-medium text-[#181818] -mt-6 mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Page Not Found
        </h1>
        <p
          className="text-[0.88rem] text-[#6B6560] mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold px-8 py-3.5 transition-all duration-250"
          style={{ background: '#FF5C2B', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#E04618'}
          onMouseLeave={e => e.currentTarget.style.background = '#FF5C2B'}
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
