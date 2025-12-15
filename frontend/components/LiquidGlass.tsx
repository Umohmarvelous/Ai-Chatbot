'use client';

import { ReactNode, useMemo } from 'react';

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  variant?: 'input' | 'output';
  colorIndex?: number; // Optional index to use a specific color
}

// Color palette
const colors = ['#202e32', '#85937a', 'green', '#000', 'transparent'];

export default function LiquidGlass({ children, className = '', variant = 'input', colorIndex }: LiquidGlassProps) {
  // Use provided colorIndex or assign based on variant
  const bgColor = useMemo(() => {
    if (colorIndex !== undefined) {
      // return colors[0];
      return colors[colorIndex % colors.length];
    }
    // Random selection for variety
    const index = variant === 'input' ? 3 : 1;
    return colors[index];

  }, [variant, colorIndex]);

  // const borderColor = useMemo(() => {
  //   if (colorIndex !== undefined) {
  //     return colors[(colorIndex + 1) % colors.length];
  //   }
  //   // Use different color for border
  //   const index = variant === 'input' ? 3 : 4;
  //   return colors[index];
  // }, [variant, colorIndex]);

  return (
    <div
      className={`relative ${className}`}
    >
      {/* Main container with pill shape - no glassy effects */}
      <div
        // className={`relative rounded-none overflow-hidden ${variant === 'input' ? ' bg-red-400' : 'bg-pink-400'} `}
        style={{
          // backgroundColor:'backColor',
          // border: `.2px solid ${colors[4]}`,
          // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Content */}
        <div className="relative z-10 p-3 md:p-2">
          {children}
        </div>
      </div>
    </div>
  );
}
// className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-2xl overflow-hidden flex flex-col min-h-[160px]">
