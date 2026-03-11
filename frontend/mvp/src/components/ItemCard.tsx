import { Sparkles } from 'lucide-react'
import type { IItem } from '../types'
import { resolveImageUrl } from '../services/api'

interface Props {
  item: IItem
  selected: boolean
  onToggle: (id: string) => void
}

export default function ItemCard({ item, selected, onToggle }: Props) {
  return (
    <button
      data-testid="item-card"
      onClick={() => onToggle(item._id)}
      className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-300 ${
        selected
          ? 'border-black ring-2 ring-black ring-offset-2 scale-95'
          : 'border-transparent hover:shadow-lg'
      }`}
    >
      <img
        src={resolveImageUrl(item.imageUrl)}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">
          {item.name}
        </p>
      </div>
      {selected && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Sparkles className="text-white drop-shadow-md" />
        </div>
      )}
    </button>
  )
}
