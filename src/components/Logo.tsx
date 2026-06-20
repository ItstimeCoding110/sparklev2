import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showBackground = false,
}) => {
  // Size classes mapping
  const sizeClasses = {
    sm: 'w-24 h-10',
    md: 'w-36 h-16',
    lg: 'w-48 h-20',
    full: 'w-full h-full aspect-square max-w-[400px]',
  };

  return (
    <div 
      className={`relative select-none flex items-center ${showBackground ? 'bg-[#EAE5D9] p-4 rounded-2xl border-3 border-[#000000] shadow-[4px_4px_0px_#000000] justify-center' : 'justify-start'} ${sizeClasses[size]} ${className}`}
      id="goodtobesparkle-brand-logo"
    >
      <img
        src="/logo.png"
        alt="goodtobe.sparkle"
        className={`w-full h-full object-contain mix-blend-multiply pointer-events-none ${
          showBackground ? 'object-center' : 'object-left'
        }`}
      />
    </div>
  );
};
