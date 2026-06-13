'use client'
import { createContext, useContext, useState, useCallback } from 'react'

interface CartItem {
  slug: string
  name: string
  subtitle: string
  material: string
  price: number
  qty: number
}

interface CartContextType {
  items: CartItem[]
  open: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'qty'>) => void
  updateQty: (slug: string, material: string, delta: number) => void
  removeItem: (slug: string, material: string) => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  open: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  updateQty: () => {},
  removeItem: () => {},
})

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])

  const addItem = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug && i.material === item.material)
      if (existing) return prev.map((i) =>
        i.slug === item.slug && i.material === item.material
          ? { ...i, qty: i.qty + 1 }
          : i
      )
      return [...prev, { ...item, qty: 1 }]
    })
    setOpen(true)
  }, [])

  const updateQty = useCallback((slug: string, material: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => i.slug === slug && i.material === material ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    )
  }, [])

  const removeItem = useCallback((slug: string, material: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.material === material)))
  }, [])

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, open, openCart, closeCart, addItem, updateQty, removeItem }}>
      {children}

      {/* Cart drawer */}
      <div
        className="fixed top-0 right-0 h-full z-[9996] flex flex-col"
        style={{
          width: '380px',
          maxWidth: '100vw',
          backgroundColor: 'var(--ivory)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
          boxShadow: open ? '-8px 0 40px rgba(14,27,46,0.15)' : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '0.5px solid var(--linen)' }}
        >
          <p className="label" style={{ color: 'var(--navy)' }}>
            Cart <span style={{ color: 'var(--gold)' }}>({items.length})</span>
          </p>
          <button
            onClick={closeCart}
            className="label"
            style={{ color: 'var(--steel)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Close ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <p className="body-sm" style={{ color: 'var(--steel)', textAlign: 'center', marginTop: '40px' }}>
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div key={`${item.slug}-${item.material}`} style={{ borderBottom: '0.5px solid var(--linen)', paddingBottom: '16px' }}>
                <div className="flex items-start justify-between gap-3">
                  {/* Image placeholder */}
                  <div
                    className="flex-shrink-0"
                    style={{ width: '64px', height: '80px', backgroundColor: 'var(--charcoal)' }}
                  />
                  <div className="flex-1">
                    <p className="body-sm font-medium" style={{ color: 'var(--navy)' }}>{item.name}</p>
                    <p className="label-sm mt-0.5" style={{ color: 'var(--steel)' }}>{item.material}</p>
                    <p className="label-sm mt-1" style={{ color: 'var(--gold)' }}>
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </p>
                    {/* Qty stepper */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQty(item.slug, item.material, -1)}
                        className="label"
                        style={{ color: 'var(--steel)', background: 'none', border: '0.5px solid var(--linen)', width: '24px', height: '24px', cursor: 'pointer' }}
                      >−</button>
                      <span className="label" style={{ color: 'var(--navy)' }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.slug, item.material, 1)}
                        className="label"
                        style={{ color: 'var(--steel)', background: 'none', border: '0.5px solid var(--linen)', width: '24px', height: '24px', cursor: 'pointer' }}
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6" style={{ borderTop: '0.5px solid var(--linen)' }}>
            <div className="flex justify-between mb-6">
              <p className="label" style={{ color: 'var(--steel)' }}>Subtotal</p>
              <p className="label" style={{ color: 'var(--gold)' }}>₹{total.toLocaleString('en-IN')}</p>
            </div>
            <button className="btn-primary btn-navy w-full mb-3">
              <span>Proceed to checkout →</span>
            </button>
            <p className="body-sm text-center mt-3" style={{ color: 'var(--steel)' }}>
              <a href="/contact" style={{ textDecoration: 'underline', textUnderlineOffset: '3px', color: 'var(--navy)' }}>
                Or enquire about this piece
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9995]"
          style={{ backgroundColor: 'rgba(14,27,46,0.3)' }}
          onClick={closeCart}
        />
      )}
    </CartContext.Provider>
  )
}
