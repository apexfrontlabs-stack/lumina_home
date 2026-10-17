import { Drawer } from '../common/Drawer'
import { Button } from '../common/Button'
import { PriceTag } from '../common/PriceTag'
import { CartItem } from './CartItem'

export function CartDrawer({ open, onClose, items = [], onQuantityChange, onRemove }) {
  const subtotal = items.reduce((sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0)

  const footer = items.length > 0 && (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between text-sm">
        <span className="uppercase tracking-widest text-brand-gray">Subtotal</span>
        <PriceTag price={subtotal} size="lg" />
      </div>
      <p className="text-xs text-brand-gray">Shipping and taxes calculated at checkout.</p>
      <Button fullWidth href="/checkout" onClick={onClose}>Checkout</Button>
    </div>
  )

  return (
    <Drawer open={open} onClose={onClose} title="Your Cart" footer={footer}>
      {items.length === 0 ? (
        <p className="py-12 text-center font-sans text-sm text-brand-gray">Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <CartItem key={item.id} item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />
        ))
      )}
    </Drawer>
  )
}