import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-400 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-charcoal-800 text-white hover:bg-charcoal-700 shadow-sm",
    secondary: "bg-charcoal-100 text-charcoal-900 hover:bg-charcoal-200",
    ghost: "hover:bg-charcoal-100 hover:text-charcoal-900",
    outline: "border border-charcoal-200 bg-white hover:bg-charcoal-50 text-charcoal-900",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 py-2 text-sm",
    lg: "h-10 px-8 text-base",
    icon: "h-9 w-9",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
