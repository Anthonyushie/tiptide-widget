import { useEffect, useState } from 'react';

interface ZapLocation {
  id: string;
  x: number;
  y: number;
  country: string;
  amount: number;
  delay: number;
}

export function WorldMapAnimation() {
  const [activeZaps, setActiveZaps] = useState<Set<string>>(new Set());

  // Sample zap locations with coordinates relative to SVG viewBox
  const zapLocations: ZapLocation[] = [
    { id: 'usa', x: 240, y: 180, country: 'United States', amount: 2100, delay: 0 },
    { id: 'canada', x: 220, y: 120, country: 'Canada', amount: 850, delay: 500 },
    { id: 'uk', x: 480, y: 140, country: 'United Kingdom', amount: 1200, delay: 1000 },
    { id: 'germany', x: 520, y: 150, country: 'Germany', amount: 950, delay: 1500 },
    { id: 'japan', x: 780, y: 200, country: 'Japan', amount: 1800, delay: 2000 },
    { id: 'australia', x: 800, y: 320, country: 'Australia', amount: 650, delay: 2500 },
    { id: 'brazil', x: 320, y: 280, country: 'Brazil', amount: 750, delay: 3000 },
    { id: 'south_africa', x: 540, y: 320, country: 'South Africa', amount: 420, delay: 3500 },
    { id: 'india', x: 680, y: 220, country: 'India', amount: 1100, delay: 4000 },
    { id: 'china', x: 720, y: 180, country: 'China', amount: 1600, delay: 4500 },
    { id: 'russia', x: 650, y: 120, country: 'Russia', amount: 580, delay: 5000 },
    { id: 'mexico', x: 200, y: 220, country: 'Mexico', amount: 480, delay: 5500 },
  ];

  useEffect(() => {
    // Animate zaps appearing in sequence
    zapLocations.forEach((location) => {
      setTimeout(() => {
        setActiveZaps(prev => new Set([...prev, location.id]));
      }, location.delay);
    });

    // Reset animation every 10 seconds
    const resetInterval = setInterval(() => {
      setActiveZaps(new Set());
      zapLocations.forEach((location) => {
        setTimeout(() => {
          setActiveZaps(prev => new Set([...prev, location.id]));
        }, location.delay);
      });
    }, 10000);

    return () => clearInterval(resetInterval);
  }, []);

  const getZapSize = (amount: number) => {
    if (amount > 1500) return 8;
    if (amount > 1000) return 6;
    if (amount > 500) return 4;
    return 3;
  };

  const getZapColor = (amount: number) => {
    if (amount > 1500) return '#f59e0b'; // Bitcoin orange
    if (amount > 1000) return '#10b981'; // Success green
    if (amount > 500) return '#3b82f6'; // Info blue
    return '#6b7280'; // Gray
  };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ background: 'hsl(var(--muted))' }}
      >
        {/* Simplified World Map Paths */}
        <g fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1">
          {/* North America */}
          <path d="M 150 80 L 300 80 L 320 120 L 280 180 L 250 200 L 200 220 L 180 200 L 160 160 L 140 120 Z" />
          
          {/* South America */}
          <path d="M 280 240 L 320 240 L 340 280 L 350 320 L 340 360 L 320 380 L 300 370 L 290 340 L 285 300 Z" />
          
          {/* Europe */}
          <path d="M 480 100 L 540 100 L 560 120 L 550 140 L 520 160 L 480 150 L 470 130 Z" />
          
          {/* Africa */}
          <path d="M 480 180 L 540 180 L 560 220 L 570 280 L 560 340 L 540 360 L 500 350 L 480 320 L 485 250 Z" />
          
          {/* Asia */}
          <path d="M 580 80 L 780 80 L 800 120 L 790 160 L 760 180 L 720 200 L 680 190 L 640 160 L 600 140 L 580 120 Z" />
          
          {/* Australia */}
          <path d="M 760 300 L 820 300 L 840 320 L 830 340 L 800 350 L 770 340 L 760 320 Z" />
          
          {/* Additional landmasses for better world representation */}
          <path d="M 600 200 L 680 200 L 700 240 L 680 260 L 640 250 L 610 230 Z" /> {/* India */}
          <path d="M 700 160 L 760 160 L 780 180 L 770 200 L 740 190 L 710 180 Z" /> {/* China */}
          <path d="M 580 60 L 720 60 L 740 80 L 720 100 L 680 90 L 600 80 Z" /> {/* Russia */}
        </g>

        {/* Grid lines for better visual reference */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Zap Activity Dots */}
        {zapLocations.map((location) => (
          <g key={location.id}>
            {/* Outer pulse ring */}
            <circle
              cx={location.x}
              cy={location.y}
              r={getZapSize(location.amount) * 3}
              fill={getZapColor(location.amount)}
              opacity={activeZaps.has(location.id) ? "0.2" : "0"}
              className="transition-all duration-1000"
            >
              {activeZaps.has(location.id) && (
                <animate
                  attributeName="r"
                  values={`${getZapSize(location.amount)};${getZapSize(location.amount) * 4};${getZapSize(location.amount)}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
              {activeZaps.has(location.id) && (
                <animate
                  attributeName="opacity"
                  values="0.4;0.1;0.4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Main zap dot */}
            <circle
              cx={location.x}
              cy={location.y}
              r={getZapSize(location.amount)}
              fill={getZapColor(location.amount)}
              opacity={activeZaps.has(location.id) ? "1" : "0"}
              className="transition-all duration-500"
            >
              {activeZaps.has(location.id) && (
                <animate
                  attributeName="opacity"
                  values="1;0.6;1"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>

            {/* Lightning bolt icon for high-value zaps */}
            {location.amount > 1500 && activeZaps.has(location.id) && (
              <text
                x={location.x}
                y={location.y + 2}
                textAnchor="middle"
                fontSize="12"
                fill="#fbbf24"
                opacity="0.8"
              >
                ⚡
                <animate
                  attributeName="opacity"
                  values="0.8;0.4;0.8"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </text>
            )}
          </g>
        ))}

        {/* Connection lines between active zaps */}
        {zapLocations.map((location, index) => {
          const nextLocation = zapLocations[(index + 1) % zapLocations.length];
          return (
            <line
              key={`connection-${location.id}`}
              x1={location.x}
              y1={location.y}
              x2={nextLocation.x}
              y2={nextLocation.y}
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              opacity={activeZaps.has(location.id) && activeZaps.has(nextLocation.id) ? "0.3" : "0"}
              className="transition-all duration-1000"
              strokeDasharray="5,5"
            >
              {activeZaps.has(location.id) && activeZaps.has(nextLocation.id) && (
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;10"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </line>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm brutal-border brutal-shadow-sm rounded-md p-2">
        <div className="text-xs font-jetbrains font-semibold mb-1">Live Zap Activity</div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-bitcoin"></div>
            <span>High (1500+ sats)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span>Medium (1000+ sats)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-info"></div>
            <span>Low (500+ sats)</span>
          </div>
        </div>
      </div>

      {/* Real-time stats overlay */}
      <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm brutal-border brutal-shadow-sm rounded-md p-2">
        <div className="text-xs font-jetbrains font-semibold text-accent">
          🌍 Global Activity
        </div>
        <div className="text-xs text-muted-foreground">
          {activeZaps.size} regions active
        </div>
      </div>
    </div>
  );
}