import React from 'react'

export enum EButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
}

interface IButton {
  variant?: EButtonVariant
}

const Button = ({
  disabled = false,
  variant = EButtonVariant.primary,
  className,
  children,
  ...props
}: React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & IButton
>) => {
  const variantStyle =
    variant === EButtonVariant.primary
      ? 'text-white bg-pink-500'
      : 'text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white'

  return (
    <button
      {...props}
      className={`px-3 py-2 font-bold rounded-lg ${variantStyle} ${
        disabled ? 'opacity-50' : ''
      } ${className || ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
