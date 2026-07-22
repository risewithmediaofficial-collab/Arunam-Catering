/**
 * ImagePlaceholder — renders a real <img> when src is provided,
 * otherwise a clean minimal placeholder that doesn't distract from layout.
 */
export default function ImagePlaceholder({
  src,
  alt = '',
  className = '',
  aspectRatio = 'aspect-[4/3]',
  label = 'Image',
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`${aspectRatio} w-full relative overflow-hidden ${className}`}
      role="img"
      aria-label={`Placeholder: ${label}`}
      style={{ background: 'linear-gradient(135deg, #EDE5D8 0%, #E0D4C0 100%)' }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(#FF5C2B 1px, transparent 1px), linear-gradient(90deg, #FF5C2B 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Center mark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
        <svg
          width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="#FF5C2B" strokeWidth="1"
          strokeLinecap="round" strokeLinejoin="round"
          opacity="0.5"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(184,137,46,0.45)', fontFamily: 'Inter, sans-serif' }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
