import { useState } from 'react'

// Suggested CDN providers with placeholder guidance
const CDN_TIPS = [
  'Cloudinary — cloudinary.com/your-cloud/image/upload/filename.jpg',
  'ImageKit — ik.imagekit.io/your-id/filename.jpg',
  'AWS S3 — s3.amazonaws.com/bucket/filename.jpg',
  'Unsplash (demo) — images.unsplash.com/photo-ID?w=800',
  'Any direct HTTPS image URL',
]

export default function ImageManager({ images = [], onChange, maxImages = 6 }) {
  const [inputUrl, setInputUrl] = useState('')
  const [error, setError] = useState('')
  const [previewing, setPreviewing] = useState(null)
  const [loadErrors, setLoadErrors] = useState({})

  const validateUrl = (url) => {
    try {
      const u = new URL(url)
      return u.protocol === 'https:' || u.protocol === 'http:'
    } catch {
      return false
    }
  }

  const addImage = () => {
    const url = inputUrl.trim()
    if (!url) return
    if (!validateUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://')
      return
    }
    if (images.includes(url)) {
      setError('This image URL is already added')
      return
    }
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }
    setError('')
    onChange([...images, url])
    setInputUrl('')
  }

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index))
    setLoadErrors(prev => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addImage() }
  }

  return (
    <div>
      {/* Current images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {images.map((url, i) => (
            <div key={i} className="relative group bg-artisan-cream aspect-square overflow-hidden border border-artisan-warm">
              {loadErrors[i] ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                  <svg className="w-6 h-6 text-red-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="font-body text-xs text-red-500">Failed to load</p>
                  <p className="font-body text-xs text-gray-400 break-all mt-1">{url.slice(0, 30)}...</p>
                </div>
              ) : (
                <img
                  src={url}
                  alt={`Product image ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => setLoadErrors(prev => ({ ...prev, [i]: true }))}
                />
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {i > 0 && (
                  <button onClick={() => moveImage(i, i - 1)} title="Move left"
                    className="w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center text-artisan-charcoal text-xs font-bold">
                    ←
                  </button>
                )}
                <button onClick={() => setPreviewing(url)} title="Preview"
                  className="w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-artisan-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button onClick={() => removeImage(i)} title="Remove"
                  className="w-7 h-7 bg-red-500 hover:bg-red-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {i < images.length - 1 && (
                  <button onClick={() => moveImage(i, i + 1)} title="Move right"
                    className="w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center text-artisan-charcoal text-xs font-bold">
                    →
                  </button>
                )}
              </div>

              {/* Primary badge */}
              {i === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-artisan-brown text-white text-xs px-1.5 py-0.5 font-body">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add URL input */}
      {images.length < maxImages && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={inputUrl}
              onChange={e => { setInputUrl(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="https://your-cdn.com/image.jpg"
              className="input-field flex-1 text-sm"
            />
            <button
              type="button"
              onClick={addImage}
              className="bg-artisan-brown text-white px-4 py-2 font-body text-xs hover:bg-artisan-brown-dark transition-colors whitespace-nowrap flex-shrink-0"
            >
              Add Image
            </button>
          </div>

          {error && (
            <p className="font-body text-xs text-red-500">{error}</p>
          )}

          {/* CDN tips */}
          <details className="group">
            <summary className="font-body text-xs text-artisan-gray-soft cursor-pointer hover:text-artisan-brown list-none flex items-center gap-1">
              <svg className="w-3 h-3 group-open:rotate-90 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Supported CDN formats
            </summary>
            <div className="mt-2 p-3 bg-gray-50 border border-gray-100">
              {CDN_TIPS.map((tip, i) => (
                <p key={i} className="font-body text-xs text-gray-500 mb-1 last:mb-0">· {tip}</p>
              ))}
            </div>
          </details>
        </div>
      )}

      <p className="font-body text-xs text-artisan-gray-soft mt-2">
        {images.length}/{maxImages} images · First image is the main product photo · Drag arrows to reorder
      </p>

      {/* Preview modal */}
      {previewing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewing(null)}>
          <div className="relative max-w-2xl max-h-[80vh]">
            <img src={previewing} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
            <button onClick={() => setPreviewing(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center text-artisan-charcoal hover:bg-gray-100">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}