import { TiptideWidget } from '@/components/TiptideWidget';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import heroImage from '@/assets/tiptide-hero.jpg';

const Index = () => {
  const [postId, setPostId] = useState('note1example123456789abcdef');
  const [customPostId, setCustomPostId] = useState('');
  const [compactMode, setCompactMode] = useState(false);

  const examplePosts = [
    {
      id: 'note1example123456789abcdef',
      title: 'Example Bitcoin Post',
      description: 'A popular post about Bitcoin adoption'
    },
    {
      id: 'note1nostr123456789abcdef',
      title: 'Nostr Protocol Discussion', 
      description: 'Technical discussion about Nostr development'
    },
    {
      id: 'note1lightning123456789abc',
      title: 'Lightning Network Update',
      description: 'Latest improvements to Lightning Network'
    }
  ];

  const handleCustomPostId = () => {
    if (customPostId.trim()) {
      setPostId(customPostId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-bitcoin bg-clip-text text-transparent">
            Tiptide
          </h1>
          <p className="text-2xl text-muted-foreground mb-4">
            Social Proof Payment Widget for Nostr
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encourage Lightning Network tips through psychology and real-time social proof. 
            Turn every payment into motivation for more.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Demo Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Widget Demo */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">
                Live Widget Demo
              </h2>
              <TiptideWidget
                postId={postId}
                relays={['wss://relay.damus.io', 'wss://nos.lol']}
                demoMode={true}
                showRealtimeActivity={true}
                compactMode={compactMode}
              />
            </div>

            {/* Compact Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={compactMode ? "default" : "outline"}
                size="sm"
                onClick={() => setCompactMode(!compactMode)}
              >
                {compactMode ? 'Full Mode' : 'Compact Mode'}
              </Button>
              <span className="text-sm text-muted-foreground">
                Toggle widget size
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Try Different Posts</h3>
              <div className="space-y-3">
                {examplePosts.map((post) => (
                  <Button
                    key={post.id}
                    variant={postId === post.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setPostId(post.id)}
                  >
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {post.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="custom-post">Custom Post ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-post"
                  placeholder="Enter Nostr post ID..."
                  value={customPostId}
                  onChange={(e) => setCustomPostId(e.target.value)}
                />
                <Button onClick={handleCustomPostId}>
                  Load
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter any Nostr note ID to see real payment data
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="text-center p-6 rounded-lg bg-card/50 border border-border/50">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Live Lightning Network payment tracking via Nostr relays
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 border border-border/50">
            <div className="text-2xl mb-3">🔥</div>
            <h3 className="font-semibold mb-2">Social Proof</h3>
            <p className="text-sm text-muted-foreground">
              Psychology-driven messaging to encourage more tips
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 border border-border/50">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">Embeddable</h3>
            <p className="text-sm text-muted-foreground">
              Responsive widget for social media and blog posts
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 bg-card/30 rounded-lg p-6 border border-border/50">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-bitcoin">Nostr Integration</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Connects to multiple Nostr relays</li>
                <li>• Subscribes to zap receipt events (kind 9735)</li>
                <li>• Parses Lightning Network payment data</li>
                <li>• Real-time WebSocket connections</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-lightning">Social Psychology</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Dynamic social proof messaging</li>
                <li>• Activity-based engagement prompts</li>
                <li>• Real-time payment notifications</li>
                <li>• Trending content indicators</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Built with Nostr, Lightning Network, and modern web technologies
          </p>
          <p className="mt-2">
            Open source • Privacy focused • Decentralized
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;