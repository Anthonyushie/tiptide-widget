import { TiptideWidget } from '@/components/TiptideWidget';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-subtle">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-8xl font-bold mb-8 gradient-text-bitcoin font-space">
            Tiptide
          </h1>
          <div className="brutal-card-accent p-8 mx-auto max-w-3xl">
            <p className="text-3xl font-bold mb-4 font-space">
              Clean Neo Brutalist Payment Widget
            </p>
            <p className="text-xl font-jetbrains text-muted-foreground">
              Social proof psychology • Lightning Network tips • Nostr protocol
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">

        {/* Demo Section */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Widget Demo */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Live Widget Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TiptideWidget
                  postId={postId}
                  relays={['wss://relay.damus.io', 'wss://nos.lol']}
                  demoMode={true}
                  showRealtimeActivity={true}
                  compactMode={compactMode}
                />
              </CardContent>
            </Card>

            {/* Compact Mode Toggle */}
            <div className="flex items-center space-x-4">
              <Button
                variant={compactMode ? "bitcoin" : "outline"}
                onClick={() => setCompactMode(!compactMode)}
                className="font-jetbrains"
              >
                {compactMode ? 'Full Mode' : 'Compact Mode'}
              </Button>
              <div className="brutal-border bg-card p-3 brutal-shadow-sm rounded-md">
                <span className="text-sm font-semibold text-muted-foreground font-jetbrains">
                  Toggle widget size
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Try Different Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {examplePosts.map((post) => (
                  <Button
                    key={post.id}
                    variant={postId === post.id ? "bitcoin" : "outline"}
                    className="w-full justify-start text-left p-6 font-jetbrains"
                    onClick={() => setPostId(post.id)}
                  >
                    <div>
                      <div className="font-bold text-lg">{post.title}</div>
                      <div className="text-sm text-muted-foreground font-normal mt-1">
                        {post.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Custom Post ID</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="custom-post" className="font-semibold font-jetbrains">
                  Enter Nostr Post ID
                </Label>
                <div className="flex space-x-3">
                  <Input
                    id="custom-post"
                    placeholder="Enter Nostr post ID..."
                    value={customPostId}
                    onChange={(e) => setCustomPostId(e.target.value)}
                    className="brutal-border font-jetbrains"
                  />
                  <Button variant="bitcoin" onClick={handleCustomPostId} className="font-jetbrains">
                    Load
                  </Button>
                </div>
                <div className="brutal-border bg-muted/20 p-3 brutal-shadow-sm rounded-md">
                  <p className="text-xs font-semibold text-muted-foreground font-jetbrains">
                    Enter any Nostr note ID to see real payment data
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <Card className="bg-accent/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">⚡</div>
              <CardTitle className="mb-4 text-foreground">Real-time Updates</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Live Lightning Network payment tracking via Nostr relays
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-bitcoin/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">🔥</div>
              <CardTitle className="mb-4 text-foreground">Social Proof</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Psychology-driven messaging to encourage more tips
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-info/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">📱</div>
              <CardTitle className="mb-4 text-foreground">Embeddable</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Responsive widget for social media and blog posts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-20 bg-muted/10">
          <CardHeader>
            <CardTitle className="text-foreground">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="brutal-border bg-bitcoin/10 p-6 brutal-shadow-bitcoin rounded-md">
                <h4 className="font-bold mb-4 text-bitcoin text-xl font-space">
                  Nostr Integration
                </h4>
                <ul className="space-y-2 font-jetbrains text-sm">
                  <li className="text-muted-foreground">• Connects to multiple Nostr relays</li>
                  <li className="text-muted-foreground">• Subscribes to zap receipt events (kind 9735)</li>
                  <li className="text-muted-foreground">• Parses Lightning Network payment data</li>
                  <li className="text-muted-foreground">• Real-time WebSocket connections</li>
                </ul>
              </div>
              <div className="brutal-border bg-accent/10 p-6 brutal-shadow-accent rounded-md">
                <h4 className="font-bold mb-4 text-accent text-xl font-space">
                  Social Psychology
                </h4>
                <ul className="space-y-2 font-jetbrains text-sm">
                  <li className="text-muted-foreground">• Dynamic social proof messaging</li>
                  <li className="text-muted-foreground">• Activity-based engagement prompts</li>
                  <li className="text-muted-foreground">• Real-time payment notifications</li>
                  <li className="text-muted-foreground">• Trending content indicators</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-20 text-center space-y-6">
          <Card className="bg-gradient-subtle">
            <CardContent className="p-8">
              <p className="text-lg font-bold font-space mb-2">
                Built with Nostr, Lightning Network, and modern web technologies
              </p>
              <p className="font-jetbrains text-sm text-muted-foreground">
                Open source • Privacy focused • Decentralized
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;