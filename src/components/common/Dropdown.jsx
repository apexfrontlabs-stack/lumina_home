import { useState, useEffect, useRef } from "react";
import { ChevronIcon } from "./Icons";

export default function Dropdown({ label, options, value, onChange, direction = "down" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm tracking-wide text-stone-800 transition-colors duration-300 hover:bg-stone-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
      >
        {current.label}
        <ChevronIcon open={open} />
      </button>

      <ul
        role="listbox"
        aria-label={label}
        className={`absolute start-0 z-50 min-w-[9rem] overflow-hidden rounded-xl border border-stone-200 bg-white/95 py-1 shadow-lg backdrop-blur-md transition-all duration-300 transform ${
          direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
        } ${
          open
            ? "visible translate-y-0 opacity-100"
            : `invisible opacity-0 ${direction === "up" ? "translate-y-1" : "-translate-y-1"}`
        }`}
      >
        {options.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-start text-sm transition-colors duration-200 hover:bg-stone-100 ${
                o.value === value ? "font-medium text-emerald-900" : "text-stone-700"
              }`}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}