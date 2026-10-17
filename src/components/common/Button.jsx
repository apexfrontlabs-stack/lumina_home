import { useTranslation } from 'react-i18next'

export default function Button({ children, type = 'button', fullWidth = false, variant = 'primary', onClick }) {
  const { t } = useTranslation() 

  const baseStyle = 'inline-flex items-center justify-center rounded text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2 active:scale-[0.98] h-10 px-5 select-none font-sans tracking-wide'

  const styles = {
    primary: 'bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-sm',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900',
    google: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900',
    facebook: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900'
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${styles[variant] || styles.primary} ${widthStyle}`}
    >
      {children}
    </button>
  )
}
