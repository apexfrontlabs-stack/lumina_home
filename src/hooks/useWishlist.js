import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';

export default function useWishlist() {
  const context = useContext(WishlistContext);
  
  if (!context) {
    console.warn(" Warning: useWishlist must be used within a WishlistProvider wrapper!");
    return { ids: [], toggle: () => {} };
  }
  
  return context;
}
