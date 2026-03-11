import { Loader2 } from 'lucide-react'
import type { IModel } from '../types'
import { resolveImageUrl } from '../services/api'

interface Props {
  model: IModel
  outfitUrl: string | null
  generating: boolean
}

export default function ModelPreview({ model, outfitUrl, generating }: Props) {
  const src = outfitUrl ? resolveImageUrl(outfitUrl) : resolveImageUrl(model.imageUrl)
  const hasOutfit = Boolean(outfitUrl)

  return (
    <div className="relative w-full max-w-[500px] h-full max-h-[90vh] bg-white rounded-[2rem] shadow-xl overflow-hidden ring-1 ring-black/5">
      <img
        data-testid="outfit-result"
        src={src}
        alt={hasOutfit ? 'Generated outfit' : 'Model preview'}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Status badge */}
      <div className="absolute top-6 left-6">
        <span
<<<<<<< HEAD
          data-testid="outfit-status-badge"
=======
>>>>>>> 26a2d1d (feat(mvp): implement frontend MVP with pages, services, and tests)
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20 backdrop-blur-md ${
            generating
              ? 'bg-emerald-500 text-white'
              : hasOutfit
                ? 'bg-black text-white'
                : 'bg-white/80 text-black'
          }`}
        >
          {generating ? 'Generating…' : hasOutfit ? 'AI Fitting Active' : 'Original Model'}
        </span>
      </div>

      {/* Generating overlay */}
      {generating && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
          <Loader2 size={48} className="text-white animate-spin" />
          <p className="text-white text-sm font-medium tracking-widest uppercase">
            AI is styling your outfit…
          </p>
        </div>
      )}
    </div>
  )
}
