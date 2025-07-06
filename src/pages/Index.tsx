import { TiptideWidget } from '@/components/TiptideWidget';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { isValidNostrNoteId } from '@/lib/nostr';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [postId, setPostId] = useState('note1a0tfjua3mdk3e5u2cd709nu9qszhzj8a2mnwp9xwyk2dymzujtmq56vcvv');
  const [customPostId, setCustomPostId] = useState('');
  const [compactMode, setCompactMode] = useState(false);

  const examplePosts = [
    {
      id: 'note1a0tfjua3mdk3e5u2cd709nu9qszhzj8a2mnwp9xwyk2dymzujtmq56vcvv',
      title: 'Derek Ross - 1 Million Zaps',
      description: 'Popular post about reaching 1M zaps milestone'
    },
    {
      id: 'note1c34vht0lu2qzrgr4az3u8jn5xl3fycr2gfpahkepthg7hzlqg26sr59amt',
      title: 'Calle - Nostr Zaps Guide',
      description: 'Technical guide on how to use Lightning zaps'
    },
    {
      id: 'note1f72205grals33mhtt2f7e545fdlk64y3kejp0hpjaxkhldphvnsqfntg9h',
      title: 'Derek Ross - Zapple Pay',
      description: 'Announcement about Zapple Pay service'
    },
    {
      id: 'note1scags6u8fre3rhyc9h457wdrhu0r2c0h4t0e4d4nrwsjj6mcg2qqc2k7am',
      title: 'Snowden - Bitcoin on Nostr',
      description: 'Snowden\'s thoughts on Bitcoin Lightning Network'
    }
  ];

  const handleCustomPostId = () => {
    if (!customPostId.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a Nostr note ID",
        variant: "destructive"
      });
      return;
    }

    if (!isValidNostrNoteId(customPostId.trim())) {
      toast({
        title: "Invalid Nostr note ID",
        description: "Please enter a valid note1... or hex format note ID",
        variant: "destructive"
      });
      return;
    }

    setPostId(customPostId.trim());
    toast({
      title: "Loading note data",
      description: "Connecting to Nostr relays to fetch zap data...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-subtle">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          {/* Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--accent)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-accent/30 rotate-45 animate-subtle-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-32 w-24 h-24 bg-bitcoin/20 border-4 border-bitcoin/40 rotate-12 animate-subtle-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-32 w-20 h-20 border-4 border-success/30 -rotate-12 animate-subtle-bounce" style={{ animationDelay: '2s' }} />
          <div className="absolute top-60 left-1/2 w-16 h-16 bg-accent/10 border-4 border-accent/30 rotate-45 animate-subtle-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 border-4 border-bitcoin/20 -rotate-45 animate-subtle-bounce" style={{ animationDelay: '1.5s' }} />
          
          {/* Lightning Bolt Shapes */}
          <div className="absolute top-32 right-1/4 text-6xl text-accent/20 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>⚡</div>
          <div className="absolute bottom-40 left-1/4 text-4xl text-bitcoin/30 animate-pulse-glow" style={{ animationDelay: '2s' }}>⚡</div>
          <div className="absolute top-1/2 right-16 text-5xl text-success/20 animate-pulse-glow" style={{ animationDelay: '1s' }}>⚡</div>
          
          {/* Diagonal Lines */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent rotate-12 origin-left" />
            <div className="absolute top-32 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bitcoin/20 to-transparent -rotate-12 origin-left" />
            <div className="absolute bottom-16 left-0 w-full h-1 bg-gradient-to-r from-transparent via-success/20 to-transparent rotate-12 origin-left" />
          </div>
          
          {/* Circular Elements */}
          <div className="absolute top-24 left-1/3 w-12 h-12 rounded-full border-4 border-accent/30 animate-subtle-bounce" style={{ animationDelay: '1.2s' }} />
          <div className="absolute bottom-24 right-1/3 w-8 h-8 rounded-full bg-bitcoin/20 border-4 border-bitcoin/40 animate-subtle-bounce" style={{ animationDelay: '0.8s' }} />
          <div className="absolute top-1/2 left-16 w-6 h-6 rounded-full border-4 border-success/30 animate-subtle-bounce" style={{ animationDelay: '1.8s' }} />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-transparent to-background/60" />
        
        <div className="relative container mx-auto px-6 py-24 text-center">
          <h1 className="text-8xl font-bold mb-8 gradient-text-bitcoin font-space relative z-10">
            Tiptide
          </h1>
          <div className="brutal-card-accent p-8 mx-auto max-w-3xl relative z-10">
            <p className="text-3xl font-bold mb-4 font-space">
              Real-time Nostr Zap Widget
            </p>
            <p className="text-xl font-jetbrains text-muted-foreground">
              Live Lightning Network tips • Social proof psychology • Nostr protocol
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
                  relays={[
                    'wss://relay.damus.io',
                    'wss://relay.primal.net',
                    'wss://relay.snort.social',
                    'wss://relay.yakihonne.com',
                    'wss://nos.lol',
                    'wss://relay.nostr.band',
                    'wss://purplepag.es',
                    'wss://nostr.wine',
                    'wss://relay.current.fyi',
                    'wss://relay.mostr.pub',
                    'wss://relay.nostrgraph.net',
                    'wss://nostr.oxtr.dev',
                    'wss://relay.nostrich.de',
                    'wss://offchain.pub',
                    'wss://relay.nostr.info',
                    'wss://relay.nostr.wirednet.jp',
                    'wss://relay.nostr.bg',
                    'wss://nostr.mom',
                    'wss://relay.nostrati.com',
                    'wss://relay.bitcoiner.social'
                  ]}
                  demoMode={false} // Start in live mode by default
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
                  Enter Real Nostr Note ID
                </Label>
                <div className="flex space-x-3">
                  <Input
                    id="custom-post"
                    placeholder="note1... or hex format"
                    value={customPostId}
                    onChange={(e) => setCustomPostId(e.target.value)}
                    className="brutal-border font-jetbrains"
                  />
                  <Button variant="bitcoin" onClick={handleCustomPostId} className="font-jetbrains">
                    Load
                  </Button>
                </div>
                <div className="brutal-border bg-accent/10 p-3 brutal-shadow-sm rounded-md">
                  <p className="text-xs font-semibold text-foreground font-jetbrains mb-2">
                    ⚡ Live Nostr Integration Active!
                  </p>
                  <p className="text-xs text-muted-foreground font-jetbrains">
                    Enter any real Nostr note ID to see live zap data from the Lightning Network
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
              <CardTitle className="mb-4 text-foreground">Real-time Zaps</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Live Lightning Network zap tracking via Nostr relays with WebSocket connections
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-bitcoin/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">🔥</div>
              <CardTitle className="mb-4 text-foreground">Social Proof</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Psychology-driven messaging that adapts based on real payment activity
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-info/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">📱</div>
              <CardTitle className="mb-4 text-foreground">Embeddable</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Responsive widget for blogs, social media, and any web platform
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
                  <li className="text-muted-foreground">• Real WebSocket connections to Nostr relays</li>
                  <li className="text-muted-foreground">• Subscribes to zap receipt events (kind 9735)</li>
                  <li className="text-muted-foreground">• Parses Lightning Network payment data</li>
                  <li className="text-muted-foreground">• Historical and real-time zap tracking</li>
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
                Open source • Privacy focused • Decentralized • Real-time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;