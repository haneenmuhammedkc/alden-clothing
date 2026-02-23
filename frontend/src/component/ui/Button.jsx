const Button = ({ children, className = "", ...props }) => {
  return (
    <button {...props}
      className={`py-3 rounded-lg text-white font-medium cursor-pointer transition-all duration-300 transform
      bg-black hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40
      active:translate-y-0 active:shadow-sm ${className}`}>
      {children}
    </button>
  )
}

export default Button