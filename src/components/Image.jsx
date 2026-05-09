import { useState } from 'react'

// Article photo. Uses picsum.photos with a stable seed per article so each
// article has its own image and the same article shows the same image across
// reloads. Shows a soft pulsing placeholder until the image loads.
//
// Note: the original spec called for `source.unsplash.com`, which Unsplash
// deprecated in 2023 and now returns 503. Picsum is the current reliable
// public-domain alternative; swap to Unsplash IDs later if you add an API key.
export default function Image({ seed, alt = '', width = 800, height = 400, className = '', rounded = 'top' }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`

  const radiusClass =
    rounded === 'top'
      ? 'rounded-t-[20px]'
      : rounded === 'bottom'
        ? 'rounded-b-[24px]'
        : rounded === 'all'
          ? 'rounded-2xl'
          : ''

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 ${radiusClass} ${className}`}
      aria-hidden={!alt}
    >
      {!errored && (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ' +
            (loaded ? 'opacity-100' : 'opacity-0')
          }
        />
      )}
      <div
        className={
          'absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 ' +
          (!loaded || errored ? 'animate-pulse' : 'opacity-0 transition-opacity duration-500')
        }
      />
    </div>
  )
}
