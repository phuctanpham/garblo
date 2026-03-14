import type React from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'

interface Props {
  onUpload: (file: File) => void
  uploading?: boolean
  compact?: boolean
  accept?: string
  label?: string
}

export default function UploadZone({
  onUpload,
  uploading = false,
  compact = false,
  accept = 'image/*',
  label = 'Upload',
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
      e.target.value = ''
    }
  }

  if (compact) {
    return (
      <label
        data-testid="upload-item"
        className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:text-black text-gray-400 transition-all"
      >
        {uploading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <>
            <UploadCloud size={24} />
            <span className="text-[10px] font-bold uppercase mt-2 tracking-widest">{label}</span>
          </>
        )}
        <input
          data-testid="item-file-input"
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
      </label>
    )
  }

  return (
    <div className="flex-1 bg-zinc-50 border-l border-gray-100 p-12 flex items-center justify-center relative group cursor-pointer hover:bg-zinc-100 transition-colors">
      <input
        data-testid="model-file-input"
        type="file"
        accept={accept}
        className="absolute inset-0 opacity-0 cursor-pointer z-20"
        onChange={handleChange}
        disabled={uploading}
      />
      <div className="text-center pointer-events-none">
        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          {uploading ? (
            <Loader2 size={32} className="text-black animate-spin" />
          ) : (
            <UploadCloud size={32} className="text-black" />
          )}
        </div>
        <p className="font-bold text-slate-900">{uploading ? 'Uploading…' : 'Click to Upload'}</p>
      </div>
    </div>
  )
}
