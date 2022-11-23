import React from 'react'

const Button = ({
  disabled = false,
  className,
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    {...props}
    className={`px-3 py-2 font-bold text-white bg-pink-500 rounded-lg ${
      disabled ? 'opacity-50' : ''
    } ${className || ''}`}
    disabled={disabled}
  >
    {children}
  </button>
)

export default Button
