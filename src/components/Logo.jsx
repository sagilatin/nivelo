// Wordmark for Nivelo: lowercase "nivelo" where the dot of the "i" is a
// small globe in the brand green. Sized via the `size` prop (text height in px).

export default function Logo({ size = 40, className = '' }) {
  const fontSize = size
  const globeR = Math.round(size * 0.22)
  const globeOffset = Math.round(size * 0.05)

  return (
    <span
      className={`relative inline-flex items-baseline leading-none select-none ${className}`}
      style={{ fontSize, lineHeight: 1 }}
      aria-label="Nivelo"
    >
      <span
        className="font-semibold tracking-[-0.04em] text-neutral-900"
        style={{ fontSize, lineHeight: 1 }}
      >
        n
      </span>
      <span className="relative inline-block" style={{ fontSize, lineHeight: 1 }}>
        <span
          className="font-semibold tracking-[-0.04em] text-neutral-900"
          style={{ fontSize, lineHeight: 1 }}
        >
          ı
        </span>
        <svg
          viewBox="0 0 24 24"
          width={globeR * 2}
          height={globeR * 2}
          aria-hidden="true"
          className="absolute"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: -(globeR * 2 + globeOffset),
            color: '#0A5C38',
          }}
        >
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path
            d="M1 12h22M12 1v22M4 5c3 3 13 3 16 0M4 19c3-3 13-3 16 0M12 1c4 4 4 18 0 22M12 1c-4 4-4 18 0 22"
            stroke="#FAFAF8"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
      <span
        className="font-semibold tracking-[-0.04em] text-neutral-900"
        style={{ fontSize, lineHeight: 1 }}
      >
        velo
      </span>
    </span>
  )
}
