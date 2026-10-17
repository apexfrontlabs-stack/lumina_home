import { Search, Heart, ShoppingBag, X, ChevronDown, Menu } from 'lucide-react';

// Unified high-end default dimensions configurations
const defaultStyle = "w-5 h-5 stroke-[1.5] transition-colors duration-300";

export const SearchIcon = ({ className = "" }) => (
  <Search className={`${defaultStyle} ${className}`} />
);

export const HeartIcon = ({ className = "" }) => (
  <Heart className={`${defaultStyle} ${className}`} />
);

export const BagIcon = ({ className = "" }) => (
  <ShoppingBag className={`${defaultStyle} ${className}`} />
);

export const CloseIcon = ({ className = "" }) => (
  <X className={`${defaultStyle} ${className}`} />
);

export const ChevronIcon = ({ className = "", open = false }) => (
  <ChevronDown 
    className={`w-3.5 h-3.5 stroke-[1.8] transition-transform duration-300 ${open ? "rotate-180" : ""} ${className}`} 
  />
);

export const MenuIcon = ({ className = "" }) => (
  <Menu className={`${defaultStyle} ${className}`} />
);
