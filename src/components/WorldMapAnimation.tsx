import { useEffect, useState } from 'react';

interface ZapLocation {
  id: string;
  x: number;
  y: number;
  country: string;
  amount: number;
  delay: number;
}

interface ConnectionLine {
  from: ZapLocation;
  to: ZapLocation;
  delay: number;
}

export function WorldMapAnimation() {
  const [activeZaps, setActiveZaps] = useState<Set<string>>(new Set());
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Enhanced zap locations with more realistic coordinates
  const zapLocations: ZapLocation[] = [
    { id: 'usa', x: 240, y: 180, country: 'United States', amount: 2100, delay: 0 },
    { id: 'canada', x: 220, y: 120, country: 'Canada', amount: 850, delay: 800 },
    { id: 'uk', x: 480, y: 140, country: 'United Kingdom', amount: 1200, delay: 1600 },
    { id: 'germany', x: 520, y: 150, country: 'Germany', amount: 950, delay: 2400 },
    { id: 'japan', x: 780, y: 200, country: 'Japan', amount: 1800, delay: 3200 },
    { id: 'australia', x: 800, y: 320, country: 'Australia', amount: 650, delay: 4000 },
    { id: 'brazil', x: 320, y: 280, country: 'Brazil', amount: 750, delay: 4800 },
    { id: 'south_africa', x: 540, y: 320, country: 'South Africa', amount: 420, delay: 5600 },
    { id: 'india', x: 680, y: 220, country: 'India', amount: 1100, delay: 6400 },
    { id: 'china', x: 720, y: 180, country: 'China', amount: 1600, delay: 7200 },
    { id: 'russia', x: 650, y: 120, country: 'Russia', amount: 580, delay: 8000 },
    { id: 'mexico', x: 200, y: 220, country: 'Mexico', amount: 480, delay: 8800 },
  ];

  // Create connection flows between major locations
  const connectionPairs: ConnectionLine[] = [
    { from: zapLocations[0], to: zapLocations[4], delay: 1000 }, // USA to Japan
    { from: zapLocations[2], to: zapLocations[9], delay: 2000 }, // UK to China
    { from: zapLocations[8], to: zapLocations[5], delay: 3000 }, // India to Australia
    { from: zapLocations[6], to: zapLocations[0], delay: 4000 }, // Brazil to USA
    { from: zapLocations[3], to: zapLocations[10], delay: 5000 }, // Germany to Russia
  ];

  useEffect(() => {
    // Animate zaps appearing in sequence
    zapLocations.forEach((location) => {
      setTimeout(() => {
        setActiveZaps(prev => new Set([...prev, location.id]));
      }, location.delay);
    });

    // Animate connections
    connectionPairs.forEach((connection, index) => {
      setTimeout(() => {
        setActiveConnections(prev => new Set([...prev, `${connection.from.id}-${connection.to.id}`]));
      }, connection.delay);
    });

    // Reset animation every 15 seconds
    const resetInterval = setInterval(() => {
      setActiveZaps(new Set());
      setActiveConnections(new Set());
      
      zapLocations.forEach((location) => {
        setTimeout(() => {
          setActiveZaps(prev => new Set([...prev, location.id]));
        }, location.delay);
      });

      connectionPairs.forEach((connection) => {
        setTimeout(() => {
          setActiveConnections(prev => new Set([...prev, `${connection.from.id}-${connection.to.id}`]));
        }, connection.delay);
      });
    }, 15000);

    return () => clearInterval(resetInterval);
  }, []);

  const getZapSize = (amount: number) => {
    if (amount > 1500) return 10;
    if (amount > 1000) return 8;
    if (amount > 500) return 6;
    return 4;
  };

  const getZapColor = (amount: number) => {
    if (amount > 1500) return 'hsl(var(--warning))'; // High value
    if (amount > 1000) return 'hsl(var(--success))'; // Medium-high
    if (amount > 500) return 'hsl(var(--info))'; // Medium
    return 'hsl(var(--muted-foreground))'; // Low
  };

  const getGlowColor = (amount: number) => {
    if (amount > 1500) return 'hsl(var(--warning) / 0.6)';
    if (amount > 1000) return 'hsl(var(--success) / 0.6)';
    if (amount > 500) return 'hsl(var(--info) / 0.6)';
    return 'hsl(var(--muted-foreground) / 0.4)';
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ 
          background: 'linear-gradient(135deg, hsl(var(--muted) / 0.3), hsl(var(--card) / 0.8))',
        }}
      >
        {/* Enhanced Gradients and Filters */}
        <defs>
          {/* Glow effects */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Pulse glow for high-value zaps */}
          <filter id="pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Map gradient */}
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--card))', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: 'hsl(var(--muted))', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--card))', stopOpacity: 0.7 }} />
          </linearGradient>

          {/* Ocean gradient */}
          <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary) / 0.1)', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--muted) / 0.2)', stopOpacity: 0.5 }} />
          </radialGradient>

          {/* Subtle grid pattern */}
          <pattern id="subtleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.2"/>
          </pattern>

          {/* Connection line gradient */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>

        {/* Ocean background with gradient */}
        <rect width="100%" height="100%" fill="url(#oceanGradient)" />
        
        {/* Subtle grid overlay */}
        <rect width="100%" height="100%" fill="url(#subtleGrid)" />

        {/* Enhanced World Map with better paths */}
        <g fill="url(#mapGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" filter="url(#glow)">
          {/* North America - More detailed */}
          <path d="M 120 90 L 180 75 L 220 85 L 280 90 L 320 110 L 340 140 L 320 170 L 290 190 L 260 210 L 220 225 L 180 220 L 140 200 L 120 170 L 110 130 Z" />
          
          {/* Greenland */}
          <path d="M 350 60 L 380 55 L 400 70 L 395 90 L 370 95 L 345 85 Z" />
          
          {/* South America - Enhanced shape */}
          <path d="M 270 250 L 300 245 L 330 255 L 350 285 L 365 320 L 370 360 L 360 390 L 340 410 L 310 415 L 290 405 L 275 385 L 265 350 L 260 320 L 265 290 Z" />
          
          {/* Europe - More detailed */}
          <path d="M 460 110 L 520 105 L 560 115 L 580 130 L 575 150 L 550 165 L 520 170 L 480 165 L 460 150 L 455 130 Z" />
          
          {/* Scandinavia */}
          <path d="M 520 80 L 540 75 L 560 85 L 555 105 L 535 110 L 515 100 Z" />
          
          {/* Africa - Enhanced */}
          <path d="M 470 185 L 520 180 L 560 190 L 580 220 L 590 260 L 595 300 L 590 340 L 580 370 L 560 390 L 530 395 L 500 385 L 475 365 L 465 340 L 460 300 L 465 260 L 470 220 Z" />
          
          {/* Asia - More comprehensive */}
          <path d="M 600 90 L 680 85 L 740 90 L 780 95 L 820 105 L 840 125 L 835 155 L 820 175 L 790 185 L 750 190 L 720 185 L 680 175 L 640 165 L 610 145 L 595 120 Z" />
          
          {/* India subcontinent */}
          <path d="M 620 210 L 670 205 L 700 220 L 720 250 L 715 280 L 690 295 L 660 290 L 635 275 L 620 250 Z" />
          
          {/* China */}
          <path d="M 720 160 L 780 155 L 800 170 L 795 190 L 770 200 L 740 195 L 720 180 Z" />
          
          {/* Southeast Asia */}
          <path d="M 720 280 L 760 275 L 780 290 L 775 310 L 750 315 L 725 305 Z" />
          
          {/* Australia - Enhanced */}
          <path d="M 760 320 L 820 315 L 860 325 L 880 340 L 875 365 L 850 380 L 820 385 L 780 380 L 760 365 L 755 345 Z" />
          
          {/* New Zealand */}
          <path d="M 890 380 L 905 375 L 910 390 L 900 400 L 885 395 Z" />
          
          {/* Japan */}
          <path d="M 800 180 L 815 175 L 825 185 L 820 200 L 805 205 L 795 195 Z" />
          
          {/* Madagascar */}
          <path d="M 580 320 L 590 315 L 595 335 L 590 350 L 580 345 Z" />
        </g>

        {/* Dynamic connection flows */}
        {connectionPairs.map((connection, index) => {
          const isActive = activeConnections.has(`${connection.from.id}-${connection.to.id}`);
          return (
            <g key={`flow-${connection.from.id}-${connection.to.id}`}>
              {/* Base connection line */}
              <line
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                opacity={isActive ? "0.6" : "0"}
                className="transition-all duration-1000"
                strokeDasharray="8,4"
                filter="url(#glow)"
              >
                {isActive && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;12"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
              
              {/* Flowing particle effect */}
              {isActive && (
                <circle
                  r="3"
                  fill="hsl(var(--accent))"
                  opacity="0.8"
                  filter="url(#pulseGlow)"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${connection.from.x},${connection.from.y} L ${connection.to.x},${connection.to.y}`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;0.3;0.8"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Enhanced Zap Activity Dots */}
        {zapLocations.map((location) => {
          const isActive = activeZaps.has(location.id);
          const isHovered = hoveredLocation === location.id;
          
          return (
            <g key={location.id}>
              {/* Outer expanding ring */}
              <circle
                cx={location.x}
                cy={location.y}
                r={getZapSize(location.amount) * 2}
                fill="none"
                stroke={getZapColor(location.amount)}
                strokeWidth="2"
                opacity={isActive ? "0.4" : "0"}
                className="transition-all duration-1000"
                filter="url(#glow)"
              >
                {isActive && (
                  <>
                    <animate
                      attributeName="r"
                      values={`${getZapSize(location.amount)};${getZapSize(location.amount) * 4};${getZapSize(location.amount)}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0.1;0.6"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>

              {/* Middle pulse ring */}
              <circle
                cx={location.x}
                cy={location.y}
                r={getZapSize(location.amount) * 1.5}
                fill={getGlowColor(location.amount)}
                opacity={isActive ? "0.3" : "0"}
                className="transition-all duration-800"
                filter="url(#glow)"
              >
                {isActive && (
                  <animate
                    attributeName="opacity"
                    values="0.5;0.15;0.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Main activity dot */}
              <circle
                cx={location.x}
                cy={location.y}
                r={getZapSize(location.amount)}
                fill={getZapColor(location.amount)}
                opacity={isActive ? "1" : "0"}
                className="transition-all duration-500 cursor-pointer"
                filter={location.amount > 1500 ? "url(#pulseGlow)" : "url(#glow)"}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {isActive && (
                  <animate
                    attributeName="opacity"
                    values="1;0.7;1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Enhanced lightning effect for high-value zaps */}
              {location.amount > 1500 && isActive && (
                <g>
                  <text
                    x={location.x}
                    y={location.y + 3}
                    textAnchor="middle"
                    fontSize="16"
                    fill="hsl(var(--warning))"
                    opacity="0.9"
                    filter="url(#pulseGlow)"
                  >
                    ⚡
                    <animate
                      attributeName="opacity"
                      values="0.9;0.5;0.9"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1;1.2;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </text>
                </g>
              )}

              {/* Hover tooltip */}
              {isHovered && isActive && (
                <g>
                  <rect
                    x={location.x + 15}
                    y={location.y - 25}
                    width="120"
                    height="35"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    rx="4"
                    opacity="0.95"
                    filter="url(#glow)"
                  />
                  <text
                    x={location.x + 20}
                    y={location.y - 12}
                    fontSize="10"
                    fill="hsl(var(--foreground))"
                    fontWeight="bold"
                  >
                    {location.country}
                  </text>
                  <text
                    x={location.x + 20}
                    y={location.y - 2}
                    fontSize="9"
                    fill="hsl(var(--muted-foreground))"
                  >
                    {location.amount.toLocaleString()} sats
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <div className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
          <span className="animate-pulse">⚡</span>
          Live Zap Activity
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-warning shadow-sm"></div>
            <span className="text-muted-foreground">High Volume (1500+ sats)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-success shadow-sm"></div>
            <span className="text-muted-foreground">Medium (1000+ sats)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-info shadow-sm"></div>
            <span className="text-muted-foreground">Standard (500+ sats)</span>
          </div>
        </div>
      </div>

      {/* Enhanced Real-time stats */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <div className="text-sm font-semibold text-primary flex items-center gap-2 mb-1">
          <span className="animate-spin">🌍</span>
          Global Network
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>{activeZaps.size} regions active</div>
          <div>{activeConnections.size} connections live</div>
          <div className="text-accent font-medium">
            {zapLocations.reduce((sum, loc) => activeZaps.has(loc.id) ? sum + loc.amount : sum, 0).toLocaleString()} sats/min
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}