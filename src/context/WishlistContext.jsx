import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // LocalStorage se save kiye hue elements load karein taake refresh par data delete na ho
  const [ids, setIds] = useState(() => {
    try {
      const saved = localStorage.getItem('lumina_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lumina_wishlist', JSON.stringify(ids));
  }, [ids]);

  // Toggle function: item wishlist me ho to remove karein, nahi to add karein
  const toggle = (id) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <WishlistContext.Provider value={{ ids, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}
