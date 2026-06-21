import React, { useMemo } from 'react';
import { Bead } from '../types';

interface BraceletVisualizerProps {
  colors?: string[];
  wording?: string;
  beadSequence?: Bead[];
  size?: 'sm' | 'md' | 'lg';
  isRotating?: boolean;
}

export const BraceletVisualizer: React.FC<BraceletVisualizerProps> = ({
  colors = ['#ff6584', '#ffd056', '#7dd3fc'],
  wording = '',
  beadSequence = [],
  size = 'md',
  isRotating = false,
}) => {
  const pixelSize = size === 'sm' ? 140 : size === 'lg' ? 260 : 200;

  // Generate sequence of beads to render
  const mappedBeads = useMemo(() => {
    // If we have a custom sequence, use that
    if (beadSequence.length > 0) {
      return [...beadSequence];
    }

    // Otherwise, generate a mock eye-catching sequence based on colors and wording
    const result: Bead[] = [];
    const colorsList = colors && colors.length > 0 ? colors : ['#ff6584', '#ffd056', '#7dd3fc'];
    const colorCount = colorsList.length;
    
    // Fill with about 16 standard beads
    for (let i = 0; i < 16; i++) {
      const color = colorsList[i % colorCount];
      
      // Add a special shape here and there
      if (i === 3) {
        result.push({ id: `m-${i}`, name: 'Star', type: 'star', color, emoji: '⭐', price: 0 });
      } else if (i === 8) {
        result.push({ id: `m-${i}`, name: 'Heart', type: 'heart', color, emoji: '💖', price: 0 });
      } else if (i === 12) {
        result.push({ id: `m-${i}`, name: 'Flower', type: 'flower', color: '#ffffff', emoji: '🌸', price: 0 });
      } else {
        result.push({ id: `m-${i}`, name: 'Round Bead', type: 'round', color, emoji: '🔴', price: 0 });
      }
    }

    // Append a custom hanging charm if any
    result.push({ id: 'm-charm', name: 'Charm', type: 'charm', color: '#ff80ab', emoji: '🎀', price: 0 });

    return result;
  }, [colors, beadSequence]);

  // Total spots on the bracelet ring (e.g., 20 beads around the loop)
  const beadCount = mappedBeads.length;
  const wordLength = wording.trim().length;

  return (
    <div
      className="relative inline-flex items-center justify-center bg-brand-dark/5 p-2 sm:p-4 rounded-3xl border-3 border-brand-dark shadow-[4px_4px_0px_#000000] overflow-hidden w-full aspect-square"
      style={{ maxWidth: pixelSize, maxHeight: pixelSize }}
    >
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full drop-shadow-[3px_4px_1px_rgba(18,18,18,0.3)]"
      >
        <defs>
          {/* Pearl Shiny Gradients */}
          <radialGradient id="pearl" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.4" />
          </radialGradient>
          
          <radialGradient id="beadhighlight" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g
          className={isRotating ? 'animate-[spin_40s_linear_infinite]' : ''}
          style={{ transformOrigin: '120px 120px' }}
        >
          {/* Bracelet core string */}
        <ellipse
          cx="120"
          cy="120"
          rx="72"
          ry="72"
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          strokeDasharray="4,4"
        />

        {/* Render Beads along the ellipse */}
        {mappedBeads.map((bead, i) => {
          // If wording exists, let's keep bottom 5-8 slots reserves for lettering blocks
          // We spread the beads in a circle of radius 74
          const ringRadiusX = 74;
          const ringRadiusY = 74;
          const centerCX = 120;
          const centerCY = 120;

          // Standard uniform angle distribution
          let angle = (i / beadCount) * 2 * Math.PI - Math.PI / 2; // offset so top is 0

          // Calculate positions
          const x = centerCX + ringRadiusX * Math.cos(angle);
          const y = centerCY + ringRadiusY * Math.sin(angle);

          // Render based on type
          if (bead.type === 'star') {
            // Star polygon centered at (x, y)
            const pts = [];
            const rOuter = 13;
            const rInner = 6;
            for (let a = 0; a < 10; a++) {
              const r = a % 2 === 0 ? rOuter : rInner;
              const currAngle = angle + (a * Math.PI) / 5;
              pts.push(
                `${x + r * Math.cos(currAngle)},${y + r * Math.sin(currAngle)}`
              );
            }
            return (
              <g key={bead.id + i}>
                <polygon
                  points={pts.join(' ')}
                  fill={bead.color}
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                {/* Shiny star dot */}
                <circle cx={x - 2} cy={y - 2} r="2" fill="#fff" opacity="0.8" />
              </g>
            );
          }

          if (bead.type === 'heart') {
            // Simple micro heart path centered at (x, y)
            const scale = 0.9;
            return (
              <g
                key={bead.id + i}
                transform={`translate(${x}, ${y}) scale(${scale})`}
              >
                <path
                  d="M0,5 C-6,0 -11,-4 -11,-10 C-11,-16 -6,-21 0,-21 C6,-21 11,-16 11,-10 C11,-4 6,0 0,5 Z"
                  fill={bead.color}
                  stroke="#000000"
                  strokeWidth="2.5"
                  transform="translate(0, 7)"
                />
                <circle cx="-3" cy="-4" r="2.5" fill="#fff" opacity="0.7" />
              </g>
            );
          }

          if (bead.type === 'flower') {
            // Little flower layout (5 petals around a center)
            const numPetals = 5;
            const petalRadius = 5;
            const flowerScale = 1.1;
            return (
              <g
                key={bead.id + i}
                transform={`translate(${x}, ${y}) scale(${flowerScale})`}
              >
                {/* Petals */}
                {Array.from({ length: numPetals }).map((_, pi) => {
                  const pAngle = (pi / numPetals) * 2 * Math.PI;
                  const px = Math.cos(pAngle) * 7;
                  const py = Math.sin(pAngle) * 7;
                  return (
                    <circle
                      key={pi}
                      cx={px}
                      cy={py}
                      r={petalRadius}
                      fill={bead.color}
                      stroke="#000000"
                      strokeWidth="1.5"
                    />
                  );
                })}
                {/* Center */}
                <circle
                  cx="0"
                  cy="0"
                  r="4.5"
                  fill="#ffe57f"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
              </g>
            );
          }

          if (bead.type === 'charm') {
            // Hanging Bow charm drawing at the absolute bottom
            const charmY = y + 16;
            return (
              <g key={bead.id + i}>
                {/* Connection Ring */}
                <circle
                  cx={x}
                  cy={y + 6}
                  r="4"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                {/* Bow Wings */}
                <path
                  d={`M ${x},${charmY} C ${x - 16},${charmY - 8} ${x - 16},${charmY + 12} ${x},${charmY + 4} C ${x + 16},${charmY + 12} ${x + 16},${charmY - 8} ${x},${charmY} Z`}
                  fill={bead.color}
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Bow Center knot */}
                <circle
                  cx={x}
                  cy={charmY + 2}
                  r="4.5"
                  fill="#ffd54f"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                {/* Tails */}
                <path
                  d={`M ${x - 2},${charmY + 6} L ${x - 8},${charmY + 16} M ${x + 2},${charmY + 6} L ${x + 8},${charmY + 16}`}
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            );
          }

          // Default is 'round' bead
          return (
            <g key={bead.id + i}>
              <circle
                cx={x}
                cy={y}
                r="10.5"
                fill={bead.color}
                stroke="#000000"
                strokeWidth="2.5"
                style={{ color: bead.color }}
              />
              {/* Pearl gradient shine effect overlay */}
              <circle
                cx={x}
                cy={y}
                r="10.5"
                fill="url(#pearl)"
                pointerEvents="none"
                style={{ color: bead.color }}
              />
              <circle
                cx={x - 3}
                cy={y - 3}
                r="4"
                fill="url(#beadhighlight)"
                pointerEvents="none"
              />
            </g>
          );
        })}

        {/* Floating Alphabet Block Beads in the Center */}
        {wordLength > 0 && (
          <g transform="translate(120, 120)">
            {/* Draw a small plaque/background for alphabet beads so it looks stable */}
            {/* Brutalist offset shadow rect */}
            <rect
              x={-((wordLength * 22) / 2) - 8 + 3}
              y="-12"
              width={wordLength * 22 + 16}
              height="30"
              rx="15"
              fill="#000000"
            />
            {/* Main plaque rect */}
            <rect
              x={-((wordLength * 22) / 2) - 8}
              y="-15"
              width={wordLength * 22 + 16}
              height="30"
              rx="15"
              fill="#ffe57f"
              stroke="#000000"
              strokeWidth="3"
            />
            {wording
              .toUpperCase()
              .split('')
              .map((char, index) => {
                const totalWidth = wordLength * 22;
                const startX = -totalWidth / 2 + 11;
                const offsetBlockX = startX + index * 22;
                return (
                  <g key={index} transform={`translate(${offsetBlockX}, 0)`}>
                    {/* Bead square block */}
                    <rect
                      x="-9"
                      y="-9"
                      width="18"
                      height="18"
                      rx="3"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2.5"
                    />
                    {/* Inner detail lines of bead block */}
                    <circle cx="-9" cy="0" r="1.5" fill="#000000" />
                    <circle cx="9" cy="0" r="1.5" fill="#000000" />
                    {/* Character */}
                    <text
                      x="0"
                      y="5.5"
                      fontFamily="sans-serif"
                      fontWeight="900"
                      fontSize="13"
                      fill="#000000"
                      textAnchor="middle"
                    >
                      {char}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>
      {/* Visual Indicator of Size in bottom right corner */}
      <div className="absolute bottom-2 right-2.5 bg-brand-dark text-white px-2 py-0.5 rounded-full text-[9px] font-mono border border-white uppercase tracking-wider">
        {wording ? `${wording}` : 'PRESET'}
      </div>
    </div>
  );
};
