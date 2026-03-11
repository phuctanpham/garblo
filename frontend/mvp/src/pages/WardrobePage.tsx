import { useState, useEffect } from 'react'
import { RefreshCw, LogOut, Sparkles, Loader2 } from 'lucide-react'
import ModelPreview from '../components/ModelPreview'
import ItemCard from '../components/ItemCard'
import UploadZone from '../components/UploadZone'
import { getItems, uploadItem } from '../services/itemService'
import { generateOutfit } from '../services/outfitService'
import type { IModel, IItem } from '../types'

interface Props {
  model: IModel
  onChangeModel: () => void
  onLogout: () => void
}

export default function WardrobePage({ model, onChangeModel, onLogout }: Props) {
  const [items, setItems] = useState<IItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [outfitUrl, setOutfitUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(() => setError('Failed to load wardrobe items.'))
  }, [])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    setOutfitUrl(null)
  }

  const handleUploadItem = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      const item = await uploadItem(file, name)
      setItems((prev) => [item, ...prev])
    } catch {
      setError('Failed to upload item.')
    } finally {
      setUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedIds.length || generating) return
    setGenerating(true)
    setError(null)
    setOutfitUrl(null)
    try {
      const outfit = await generateOutfit(model._id, selectedIds)
      setOutfitUrl(outfit.resultImageUrl)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        (err as Error)?.message ??
        'Generation failed.'
      setError(msg)
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setSelectedIds([])
    setOutfitUrl(null)
    setError(null)
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f7f2] text-slate-900 font-sans flex flex-col items-center">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-center h-[72px]">
        <div className="w-full max-w-[1400px] px-6 flex justify-between items-center h-full">
          <h1 className="text-xl font-serif tracking-[0.3em] uppercase">GARBLO</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={onChangeModel}
              className="text-[10px] font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} /> New Model
            </button>
            <div className="h-4 w-[1px] bg-gray-300" />
            <button
              onClick={onLogout}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Two-panel layout */}
      <main className="w-full max-w-[1400px] flex-1 flex flex-col md:flex-row mt-[72px] bg-white shadow-2xl h-[calc(100vh-72px)] overflow-hidden mx-auto border-x border-gray-100">
        {/* Left: Model/Outfit preview */}
        <div className="flex-[1.5] bg-[#fafafa] flex items-center justify-center p-6 md:p-10 overflow-hidden">
          <ModelPreview model={model} outfitUrl={outfitUrl} generating={generating} />
        </div>

        {/* Right: Wardrobe panel */}
        <div className="flex-1 min-w-[320px] max-w-[450px] bg-white border-l border-gray-100 flex flex-col h-full">
          <div className="p-8 border-b border-gray-50 flex-shrink-0">
            <h2 className="text-3xl font-serif mb-1">Wardrobe</h2>
            <p className="text-xs text-gray-400">
              {selectedIds.length > 0
                ? `${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''} selected`
                : 'Select items to mix & match.'}
            </p>
          </div>

          {/* Items grid */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 content-start pb-2">
            <UploadZone onUpload={handleUploadItem} uploading={uploading} compact label="Add Item" />
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                selected={selectedIds.includes(item._id)}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* Bottom actions */}
          <div className="p-6 border-t border-gray-100 flex-shrink-0 space-y-3">
            {error && (
              <p className="text-red-500 text-xs text-center bg-red-50 rounded-xl p-3">{error}</p>
            )}
            {outfitUrl && !generating && (
              <button
                onClick={handleReset}
                className="w-full border border-gray-200 text-gray-500 hover:border-black hover:text-black py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
              >
                Reset Selection
              </button>
            )}
            <button
              data-testid="generate-btn"
              onClick={handleGenerate}
              disabled={!selectedIds.length || generating}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Generate Outfit
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
