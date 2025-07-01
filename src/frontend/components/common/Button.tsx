import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
  };

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          backgroundColor: '#61dafb', // React blue
          color: '#282c34',
        }
      : {
          backgroundColor: '#555',
          color: 'white',
          border: '1px solid #777'
        };

  const disabledStyle: React.CSSProperties = disabled ? {
    opacity: 0.5,
    cursor: 'not-allowed'
  } : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variantStyle, ...disabledStyle }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
