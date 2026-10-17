import { X } from 'lucide-react'
import { PriceTag } from '../common/PriceTag'
import { QuantitySelector } from '../common/QuantitySelector'

export function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex gap-4 border-b border-neutral-200 py-4 font-sans">
      <img src={item.image} alt={item.name} className="h-24 w-20 shrink-0 object-cover" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div>
            <h4 className="text-sm font-medium text-brand-dark">{item.name}</h4>
            <p className="text-xs text-brand-gray">{item.category}</p>
          </div>
          <button type="button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)} className="text-brand-gray hover:text-brand-dark">
            <X size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector value={item.quantity} onChange={(q) => onQuantityChange(item.id, q)} />
          <PriceTag price={(item.salePrice ?? item.price) * item.quantity} size="sm" />
        </div>
      </div>
    </div>
  )
}