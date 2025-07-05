import { AggregatedStats } from '@/types/nostr';
import { useEffect, useState } from 'react';

interface SocialProofMessageProps {
  stats: AggregatedStats;
  loading: boolean;
}

const MESSAGES = {
  empty: [
    "⚡ Be the first to show some love!",
    "🎯 Start the tipping wave!",
    "✨ This post deserves some sats!",
    "🚀 Launch this post into orbit with tips!"
  ],
  few: [
    "🔥 Others are already tipping!",
    "⚡ Join the appreciation party!",
    "💫 People love this content!",
    "🎉 The community is showing support!"
  ],
  many: [
    "🚀 This post is taking off!",
    "⚡ Lightning is striking here!",
    "🔥 This content is on fire!",
    "💎 Quality content gets quality tips!"
  ],
  trending: [
    "🌟 This post is trending with tips!",
    "⚡ Lightning storm incoming!",
    "🔥 Viral content alert!",
    "💰 The sats are flowing!"
  ],
  recent: [
    "🔥 Hot! Recent tipping activity!",
    "⚡ Active tipping happening now!",
    "💫 This post is getting attention!",
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
    }, 4000);

    return () => clearInterval(interval);
  }, [stats, loading]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="h-5 w-48 bg-muted animate-pulse rounded mx-auto" />
      </div>
    );
  }

  const messages = MESSAGES[currentCategory];
  const currentMessage = messages[messageIndex];

  const getMessageStyle = () => {
    switch (currentCategory) {
      case 'trending':
      case 'recent':
        return "text-success font-semibold animate-pulse-glow";
      case 'many':
        return "text-bitcoin font-medium";
      case 'few':
        return "text-lightning";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="text-center">
      <div className={`text-sm transition-all duration-500 animate-slide-up ${getMessageStyle()}`}>
        {currentMessage}
      </div>
      
      {stats.totalCount > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {stats.totalCount} {stats.totalCount === 1 ? 'person has' : 'people have'} tipped this content
        </div>
      )}
    </div>
  );
}