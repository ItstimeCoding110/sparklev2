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
    sm: 'w-32 h-16',
    md: 'w-48 h-24',
    lg: 'w-64 h-32',
    full: 'w-full h-full aspect-square max-w-[400px]',
  };

  return (
    <div 
      className={`relative select-none flex items-center ${showBackground ? 'bg-[#EAE5D9] p-6 rounded-2xl border-3 border-[#121212] shadow-[4px_4px_0px_#121212] justify-center' : 'justify-start'} ${sizeClasses[size]} ${className}`}
      id="goodtobesparkle-brand-logo"
    >
      <svg
        viewBox="50 35 210 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Radial gradient representing the grain/glow from light-cream center to dark-grey/black outer points */}
          <radialGradient id="sparkleGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#fffbf0" stopOpacity="1" />
            <stop offset="25%" stopColor="#d8d3c5" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#3d3c39" stopOpacity="1" />
            <stop offset="100%" stopColor="#121212" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* The Beautiful 4-Point Sparkle Icon */}
        {/* Centered at (115, 100) exactly intersecting oo of 'goodtobe' and sp of 'sparkle' */}
        <path
          d="M 115,48 Q 115,100 63,100 Q 115,100 115,152 Q 115,100 167,100 Q 115,100 115,48 Z"
          fill="url(#sparkleGrad)"
          stroke="#121212"
          strokeWidth="1"
          className="animate-pulse"
          style={{ animationDuration: '4s' }}
        />

        {/* First Line text: goodtobe. */}
        <text
          x="160"
          y="108"
          textAnchor="middle"
          fill="#121212"
          className="font-serif font-medium tracking-normal select-none"
          style={{
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: '38px',
            letterSpacing: '-1.5px',
          }}
        >
          goodtobe.
        </text>

        {/* Second Line text: sparkle */}
        <text
          x="165"
          y="148"
          textAnchor="middle"
          fill="#121212"
          className="font-serif font-normal select-none"
          style={{
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
            fontSize: '39px',
            letterSpacing: '0.5px',
          }}
        >
          sparkle
        </text>
      </svg>
    </div>
  );
};
