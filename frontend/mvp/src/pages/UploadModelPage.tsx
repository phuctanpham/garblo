import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import { uploadModel } from '../services/modelService'
import type { IModel } from '../types'

interface Props {
  onModelReady: (_model: IModel) => void
}

export default function UploadModelPage({ onModelReady }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const model = await uploadModel(file)
      onModelReady(model)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDemo = async () => {
    setUploading(true)
    setError(null)
    try {
      const res = await fetch(
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
      )
      const blob = await res.blob()
      const file = new File([blob], 'demo-model.jpg', { type: 'image/jpeg' })
      const model = await uploadModel(file, 'Demo Model')
      onModelReady(model)
    } catch {
      setError('Failed to load demo model.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f7f2] flex items-center justify-center p-6">
      <div className="w-full max-w-[900px] bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row mx-auto">
        {/* Left */}
        <div className="flex-1 p-12 flex flex-col justify-center text-center md:text-left">
          <h2 className="text-4xl font-serif text-slate-900 mb-6">Setup Model</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Upload a full-body photo to begin the virtual fitting experience, or use our demo model.
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleDemo}
            disabled={uploading}
            className="inline-flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-slate-400 hover:text-black disabled:opacity-50 transition-colors uppercase tracking-wider"
          >
            Use Demo Model <ChevronRight size={16} />
          </button>
        </div>

        {/* Right */}
        <UploadZone onUpload={handleUpload} uploading={uploading} />
      </div>
    </div>
  )
}
