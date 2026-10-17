export default function NavLink({ href, active = false, onClick, className = "", children }) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group relative inline-block py-1 text-[15px] tracking-wide text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-900 ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 start-0 h-px w-full bg-emerald-900 transition-transform duration-500 ease-out ltr:origin-left rtl:origin-right ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </a>
  );
}