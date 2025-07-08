import { TiptideWidget } from '@/components/TiptideWidget';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isValidNostrNoteId } from '@/lib/nostr';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [postId, setPostId] = useState('note1a0tfjua3mdk3e5u2cd709nu9qszhzj8a2mnwp9xwyk2dymzujtmq56vcvv');
  const [customPostId, setCustomPostId] = useState('');
  const [compactMode, setCompactMode] = useState(false);

  // Enhanced relay list with Yakihonne prioritized
  const enhancedRelays = [
    // Yakihonne relays (highest priority)
    'wss://nostr-01.yakihonne.com',
    'wss://nostr-02.yakihonne.com',
    'wss://nostr-03.yakihonne.com',
    'wss://nostr-04.yakihonne.com',
    
    // High-performance relays
    'wss://relay.damus.io',
    'wss://relay.primal.net',
    'wss://relay.snort.social',
    'wss://nos.lol',
    'wss://relay.nostr.band',
    'wss://purplepag.es',
    'wss://nostr.wine',
    'wss://relay.mostr.pub',
    
    // Additional reliable relays
    'wss://relay.nostrgraph.net',
    'wss://nostr.oxtr.dev',
    'wss://relay.nostrich.de',
    'wss://nostr-pub.wellorder.net',
    'wss://relay.orangepill.dev',
    'wss://brb.io',
    'wss://offchain.pub',
    'wss://relay.nostr.info',
    'wss://relay.nostr.wirednet.jp',
    'wss://relay.nostr.bg',
    'wss://nostr.mom',
    'wss://relay.nostrati.com',
    'wss://relay.bitcoiner.social',
    'wss://relay.current.fyi',
    'wss://eden.nostr.land',
    'wss://nostr.fmt.wiz.biz',
    'wss://relay.nostr.ch',
    'wss://nostr-relay.wlvs.space'
  ];

  const examplePosts = [
    {
      id: 'note1a0tfjua3mdk3e5u2cd709nu9qszhzj8a2mnwp9xwyk2dymzujtmq56vcvv',
      title: 'Derek Ross - 1 Million Zaps',
      description: 'Popular post about reaching 1M zaps milestone',
      source: 'High activity post'
    },
    {
      id: 'note1c34vht0lu2qzrgr4az3u8jn5xl3fycr2gfpahkepthg7hzlqg26sr59amt',
      title: 'Calle - Nostr Zaps Guide',
      description: 'Technical guide on how to use Lightning zaps',
      source: 'Educational content'
    },
    {
      id: 'note1f72205grals33mhtt2f7e545fdlk64y3kejp0hpjaxkhldphvnsqfntg9h',
      title: 'Derek Ross - Zapple Pay',
      description: 'Announcement about Zapple Pay service',
      source: 'Product announcement'
    },
    {
      id: 'note1scags6u8fre3rhyc9h457wdrhu0r2c0h4t0e4d4nrwsjj6mcg2qqc2k7am',
      title: 'Snowden - Bitcoin on Nostr',
      description: 'Snowden\'s thoughts on Bitcoin Lightning Network',
      source: 'High-profile author'
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
      title: "Loading enhanced zap data ⚡",
      description: "Connecting to Yakihonne and other Nostr relays for comprehensive zap tracking...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-subtle">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          {/* Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--accent)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Enhanced Floating Geometric Shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-accent/30 rotate-45 animate-subtle-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-32 w-24 h-24 bg-bitcoin/20 border-4 border-bitcoin/40 rotate-12 animate-subtle-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-32 w-20 h-20 border-4 border-success/30 -rotate-12 animate-subtle-bounce" style={{ animationDelay: '2s' }} />
          <div className="absolute top-60 left-1/2 w-16 h-16 bg-accent/10 border-4 border-accent/30 rotate-45 animate-subtle-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 border-4 border-bitcoin/20 -rotate-45 animate-subtle-bounce" style={{ animationDelay: '1.5s' }} />
          
          {/* Enhanced Lightning Bolt Shapes */}
          <div className="absolute top-32 right-1/4 text-6xl text-accent/20 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>⚡</div>
          <div className="absolute bottom-40 left-1/4 text-4xl text-bitcoin/30 animate-pulse-glow" style={{ animationDelay: '2s' }}>⚡</div>
          <div className="absolute top-1/2 right-16 text-5xl text-success/20 animate-pulse-glow" style={{ animationDelay: '1s' }}>⚡</div>
          
          {/* Yakihonne Branding Elements */}
          <div className="absolute top-24 left-1/3 text-2xl text-accent/30 animate-pulse-glow font-jetbrains" style={{ animationDelay: '1.2s' }}>YH</div>
          <div className="absolute bottom-24 right-1/3 text-2xl text-bitcoin/40 animate-pulse-glow font-jetbrains" style={{ animationDelay: '0.8s' }}>⚡</div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-transparent to-background/60" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 gradient-text-bitcoin font-space relative z-10">
            Tiptide
          </h1>
          <div className="brutal-card-accent p-4 sm:p-6 md:p-8 mx-auto max-w-xs sm:max-w-2xl md:max-w-3xl relative z-10">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 font-space">
              Enhanced Nostr Zap Widget
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-jetbrains text-muted-foreground mb-4">
              Live Lightning Network tips • Yakihonne integration • Multi-relay coverage
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
              <Badge variant="accent" className="font-jetbrains text-xs sm:text-sm">
                ⚡ Yakihonne Relays
              </Badge>
              <Badge variant="secondary" className="font-jetbrains text-xs sm:text-sm">
                🌐 30+ Relays
              </Badge>
              <Badge variant="success" className="font-jetbrains text-xs sm:text-sm">
                📊 Real-time Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">

        {/* Enhanced Demo Section */}
        <div className="grid gap-6 sm:gap-8 md:gap-12 lg:grid-cols-2">
          {/* Widget Demo */}
          <div className="space-y-6 sm:space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-base sm:text-lg">Enhanced Live Widget Demo</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="accent" className="font-jetbrains text-xs">
                      ⚡ Yakihonne
                    </Badge>
                    <Badge variant="success" className="font-jetbrains text-xs">
                      Live
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TiptideWidget
                  postId={postId}
                  relays={enhancedRelays}
                  demoMode={false}
                  showRealtimeActivity={true}
                  compactMode={compactMode}
                />
              </CardContent>
            </Card>

            {/* Enhanced Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant={compactMode ? "bitcoin" : "outline"}
                onClick={() => setCompactMode(!compactMode)}
                className="font-jetbrains"
              >
                {compactMode ? 'Full Mode' : 'Compact Mode'}
              </Button>
              <div className="brutal-border bg-card p-3 brutal-shadow-sm rounded-md">
                <span className="text-sm font-semibold text-muted-foreground font-jetbrains">
                  Enhanced with {enhancedRelays.filter(r => r.includes('yakihonne')).length} Yakihonne relays
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-between">
                  Try Different Posts
                  <Badge variant="accent" className="font-jetbrains text-xs">
                    Enhanced Data
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {examplePosts.map((post) => (
                  <Button
                    key={post.id}
                    variant={postId === post.id ? "bitcoin" : "outline"}
                    className="w-full justify-start text-left p-6 font-jetbrains"
                    onClick={() => setPostId(post.id)}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-lg">{post.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {post.source}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground font-normal">
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
                <div className="brutal-border bg-accent/10 p-4 brutal-shadow-accent rounded-md">
                  <p className="text-xs font-semibold text-foreground font-jetbrains mb-2">
                    ⚡ Enhanced Yakihonne Integration Active!
                  </p>
                  <p className="text-xs text-muted-foreground font-jetbrains mb-2">
                    Prioritizing Yakihonne relays for optimal zap data coverage
                  </p>
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge variant="accent" className="text-xs">
                      4 Yakihonne relays
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {enhancedRelays.length - 4} other relays
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Feature Highlights */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <Card className="bg-accent/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">⚡</div>
              <CardTitle className="mb-4 text-foreground">Yakihonne Priority</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Prioritized connection to Yakihonne relays for enhanced zap data coverage and reliability
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-bitcoin/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">🌐</div>
              <CardTitle className="mb-4 text-foreground">Multi-Relay Coverage</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Connected to 30+ high-quality Nostr relays for comprehensive Lightning Network data
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-info/10 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">📊</div>
              <CardTitle className="mb-4 text-foreground">Enhanced Analytics</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains">
                Advanced zap tracking with relay source identification and performance metrics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Technical Details */}
        <Card className="mt-20 bg-muted/10">
          <CardHeader>
            <CardTitle className="text-foreground">Enhanced Nostr Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="brutal-border bg-accent/10 p-6 brutal-shadow-accent rounded-md">
                <h4 className="font-bold mb-4 text-accent text-xl font-space">
                  Yakihonne Integration ⚡
                </h4>
                <ul className="space-y-2 font-jetbrains text-sm">
                  <li className="text-muted-foreground">• Priority connection to 4 Yakihonne relays</li>
                  <li className="text-muted-foreground">• Enhanced zap data coverage and reliability</li>
                  <li className="text-muted-foreground">• Optimized for Yakihonne ecosystem content</li>
                  <li className="text-muted-foreground">• Real-time performance monitoring</li>
                </ul>
              </div>
              <div className="brutal-border bg-bitcoin/10 p-6 brutal-shadow-bitcoin rounded-md">
                <h4 className="font-bold mb-4 text-bitcoin text-xl font-space">
                  Multi-Relay Architecture
                </h4>
                <ul className="space-y-2 font-jetbrains text-sm">
                  <li className="text-muted-foreground">• 30+ high-quality Nostr relays</li>
                  <li className="text-muted-foreground">• Intelligent relay prioritization</li>
                  <li className="text-muted-foreground">• Automatic failover and redundancy</li>
                  <li className="text-muted-foreground">• Enhanced data aggregation</li>
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
                Enhanced with Yakihonne • Powered by Lightning Network
              </p>
              <p className="font-jetbrains text-sm text-muted-foreground">
                Multi-relay architecture • Real-time zap tracking • Decentralized • Open source
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;