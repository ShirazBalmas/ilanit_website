import { createContext, useContext, useEffect, useState } from 'react';
import { calcUnitPrice } from '../utils/price.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // each cart line keeps a snapshot of the product fields needed for pricing
  // and display; customization makes every line unique
  function addItem(product, customization, quantity) {
    setItems((prev) => [
      ...prev,
      {
        lineId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        productId: product._id,
        slug: product.slug,
        name: product.name,
        image: product.images?.[0] || '',
        basePrice: product.basePrice,
        customizationOptions: product.customizationOptions,
        customization,
        quantity,
      },
    ]);
  }

  function updateQuantity(lineId, quantity) {
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }

  function removeItem(lineId) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce(
    (sum, i) =>
      sum +
      calcUnitPrice({ basePrice: i.basePrice, customizationOptions: i.customizationOptions }, i.customization) *
        i.quantity,
    0
  );
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
