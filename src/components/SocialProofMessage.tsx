import { AggregatedStats } from '@/types/nostr';
import { useEffect, useState } from 'react';

interface SocialProofMessageProps {
  stats: AggregatedStats;
  loading: boolean;
}

const MESSAGES = {
  empty: [
    "⚡ BREAK THE SILENCE - TIP FIRST!",
    "🎯 START THE CHAOS - TIP NOW!",
    "✨ UNLEASH THE STORM - TIP THIS!",
    "🚀 IGNITE THE FRENZY - TIP HARD!"
  ],
  few: [
    "🔥 OTHERS ARE ALREADY TIPPING!",
    "⚡ JOIN THE TIP REVOLUTION!",
    "💫 PEOPLE ARE LOVING THIS!",
    "🎉 THE COMMUNITY IS PUMPED!"
  ],
  many: [
    "🚀 THIS POST IS EXPLODING!",
    "⚡ LIGHTNING IS STRIKING!",
    "🔥 CONTENT IS ON FIRE!",
    "💎 QUALITY GETS QUALITY TIPS!"
  ],
  trending: [
    "🌟 VIRAL TIPPING MADNESS!",
    "⚡ LIGHTNING STORM INCOMING!",
    "🔥 BRUTAL TIP EXPLOSION!",
    "💰 SATS ARE FLOWING HARD!"
  ],
  recent: [
    "🔥 HOT! RECENT TIP ACTIVITY!",
    "⚡ ACTIVE TIPPING RIGHT NOW!",
    "💫 THIS POST IS TRENDING!",
    "🎯 TIP MOMENTUM BUILDING!"
  ]
};

export function SocialProofMessage({ stats, loading }: SocialProofMessageProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<keyof typeof MESSAGES>('empty');

  useEffect(() => {
    if (loading) return;

    let category: keyof typeof MESSAGES = 'empty';
    
    if (stats.totalCount === 0) {
      category = 'empty';
    } else if (stats.recentCount > 5) {
      category = 'recent';
    } else if (stats.totalCount > 50) {
      category = 'trending';
    } else if (stats.totalCount > 10) {
      category = 'many';
    } else if (stats.totalCount > 0) {
      category = 'few';
    }

    setCurrentCategory(category);
    
    // Cycle through messages in the category
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES[category].length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats, loading]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="h-12 w-80 bg-muted brutal-border brutal-shadow animate-pulse mx-auto" />
      </div>
    );
  }

  const messages = MESSAGES[currentCategory];
  const currentMessage = messages[messageIndex];

  const getMessageStyle = () => {
    switch (currentCategory) {
      case 'trending':
      case 'recent':
        return "brutal-card bg-gradient-neon text-primary-foreground text-xl font-bold uppercase tracking-widest animate-neon-pulse";
      case 'many':
        return "brutal-card bg-gradient-bitcoin text-primary-foreground text-lg font-bold uppercase tracking-wider brutal-shadow-color";
      case 'few':
        return "brutal-card bg-lightning/20 text-foreground text-base font-bold uppercase tracking-wide brutal-shadow";
      default:
        return "brutal-card bg-muted/50 text-foreground text-base font-bold uppercase tracking-wide";
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className={`p-6 transition-all duration-500 animate-slide-brutal ${getMessageStyle()}`}>
        <div className="font-jetbrains">
          {currentMessage}
        </div>
      </div>
      
      {stats.totalCount > 0 && (
        <div className="brutal-border bg-card p-3 brutal-shadow-sm">
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-jetbrains">
            {stats.totalCount} {stats.totalCount === 1 ? 'PERSON HAS' : 'PEOPLE HAVE'} TIPPED THIS CONTENT
          </div>
        </div>
      )}
    </div>
  );
}