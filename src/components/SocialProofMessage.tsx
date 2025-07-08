import { AggregatedStats } from '@/types/nostr';
import { useEffect, useState } from 'react';

interface SocialProofMessageProps {
  stats: AggregatedStats;
  loading: boolean;
}

const MESSAGES = {
  empty: [
    "⚡ Break the silence - tip first!",
    "🎯 Start the momentum - tip now!",
    "✨ Be the first to show appreciation!",
    "🚀 Ignite the conversation - tip!"
  ],
  few: [
    "🔥 Others are already tipping!",
    "⚡ Join the appreciation!",
    "💫 People are loving this!",
    "🎉 The community is engaged!"
  ],
  many: [
    "🚀 This post is gaining traction!",
    "⚡ Lightning is striking!",
    "🔥 Content is resonating!",
    "💎 Quality gets quality tips!"
  ],
  trending: [
    "🌟 Viral tipping activity!",
    "⚡ Lightning storm incoming!",
    "🔥 Tip explosion in progress!",
    "💰 Sats are flowing!"
  ],
  recent: [
    "🔥 Hot! Recent tip activity!",
    "⚡ Active tipping right now!",
    "💫 This post is trending!",
    "🎯 Tip momentum building!"
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
        <div className="h-8 sm:h-10 md:h-12 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-muted brutal-border brutal-shadow animate-pulse mx-auto rounded-md" />
      </div>
    );
  }

  const messages = MESSAGES[currentCategory];
  const currentMessage = messages[messageIndex];

  const getMessageStyle = () => {
    switch (currentCategory) {
      case 'trending':
      case 'recent':
        return "brutal-card-accent text-accent-foreground text-sm sm:text-base md:text-lg lg:text-xl font-bold animate-pulse-glow";
      case 'many':
        return "brutal-card bg-bitcoin/20 text-foreground text-sm sm:text-base md:text-lg font-bold brutal-shadow-bitcoin";
      case 'few':
        return "brutal-card bg-accent/20 text-foreground text-sm sm:text-base font-bold brutal-shadow-accent";
      default:
        return "brutal-card bg-muted/50 text-foreground text-sm sm:text-base font-bold";
    }
  };

  return (
    <div className="text-center space-y-3 sm:space-y-4">
      <div className={`p-3 sm:p-4 md:p-6 transition-all duration-500 animate-slide-up ${getMessageStyle()} rounded-md`}>
        <div className="font-jetbrains">
          {currentMessage}
        </div>
      </div>
      
      {stats.totalCount > 0 && (
        <div className="brutal-border bg-card p-2 sm:p-3 brutal-shadow-sm rounded-md">
          <div className="text-xs sm:text-sm font-semibold text-muted-foreground font-jetbrains">
            {stats.totalCount} {stats.totalCount === 1 ? 'person has' : 'people have'} tipped this content
          </div>
        </div>
      )}
    </div>
  );
}