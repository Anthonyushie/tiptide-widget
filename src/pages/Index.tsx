import { TiptideWidget } from '@/components/TiptideWidget';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-brutal">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-6 py-24 text-center">
          <h1 className="text-8xl font-bold mb-8 text-foreground font-space uppercase tracking-wider">
            TIPTIDE
          </h1>
          <div className="brutal-border bg-gradient-bitcoin text-primary-foreground p-6 brutal-shadow-color mx-auto max-w-3xl">
            <p className="text-3xl font-bold uppercase tracking-wide mb-4 font-space">
              NEO BRUTALIST PAYMENT WIDGET
            </p>
            <p className="text-xl font-jetbrains uppercase tracking-wider">
              UNLEASH THE PSYCHOLOGY OF SOCIAL PROOF • LIGHTNING NETWORK TIPS • NOSTR PROTOCOL
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">

        {/* Demo Section */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Widget Demo */}
          <div className="space-y-8">
            <Card className="brutal-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  LIVE WIDGET DEMO
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
                {compactMode ? 'FULL MODE' : 'COMPACT MODE'}
              </Button>
              <div className="brutal-border bg-card p-3 brutal-shadow-sm">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-jetbrains">
                  TOGGLE WIDGET SIZE
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <Card className="brutal-card">
              <CardHeader>
                <CardTitle className="text-foreground">TRY DIFFERENT POSTS</CardTitle>
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
                      <div className="font-bold text-lg uppercase tracking-wide">{post.title}</div>
                      <div className="text-sm text-muted-foreground font-normal mt-1 uppercase tracking-wider">
                        {post.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="brutal-card">
              <CardHeader>
                <CardTitle className="text-foreground">CUSTOM POST ID</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="custom-post" className="font-bold uppercase tracking-wider font-jetbrains">
                  ENTER NOSTR POST ID
                </Label>
                <div className="flex space-x-3">
                  <Input
                    id="custom-post"
                    placeholder="ENTER NOSTR POST ID..."
                    value={customPostId}
                    onChange={(e) => setCustomPostId(e.target.value)}
                    className="brutal-border font-jetbrains"
                  />
                  <Button variant="bitcoin" onClick={handleCustomPostId} className="font-jetbrains">
                    LOAD
                  </Button>
                </div>
                <div className="brutal-border bg-muted/20 p-3 brutal-shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-jetbrains">
                    ENTER ANY NOSTR NOTE ID TO SEE REAL PAYMENT DATA
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <Card className="brutal-card bg-gradient-bitcoin/20 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">⚡</div>
              <CardTitle className="mb-4 text-foreground">REAL-TIME UPDATES</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains uppercase tracking-wider">
                LIVE LIGHTNING NETWORK PAYMENT TRACKING VIA NOSTR RELAYS
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutal-card bg-gradient-neon/20 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">🔥</div>
              <CardTitle className="mb-4 text-foreground">SOCIAL PROOF</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains uppercase tracking-wider">
                PSYCHOLOGY-DRIVEN MESSAGING TO ENCOURAGE MORE TIPS
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutal-card bg-cyber-blue/20 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">📱</div>
              <CardTitle className="mb-4 text-foreground">EMBEDDABLE</CardTitle>
              <p className="text-sm text-muted-foreground font-jetbrains uppercase tracking-wider">
                RESPONSIVE WIDGET FOR SOCIAL MEDIA AND BLOG POSTS
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-20 brutal-card bg-muted/10">
          <CardHeader>
            <CardTitle className="text-foreground">HOW IT WORKS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="brutal-border bg-bitcoin/10 p-6 brutal-shadow-color">
                <h4 className="font-bold mb-4 text-bitcoin text-xl uppercase tracking-wider font-space">
                  NOSTR INTEGRATION
                </h4>
                <ul className="space-y-2 font-jetbrains text-sm uppercase tracking-wider">
                  <li className="text-muted-foreground">• CONNECTS TO MULTIPLE NOSTR RELAYS</li>
                  <li className="text-muted-foreground">• SUBSCRIBES TO ZAP RECEIPT EVENTS (KIND 9735)</li>
                  <li className="text-muted-foreground">• PARSES LIGHTNING NETWORK PAYMENT DATA</li>
                  <li className="text-muted-foreground">• REAL-TIME WEBSOCKET CONNECTIONS</li>
                </ul>
              </div>
              <div className="brutal-border bg-brutal-purple/10 p-6 brutal-shadow-neon">
                <h4 className="font-bold mb-4 text-brutal-purple text-xl uppercase tracking-wider font-space">
                  SOCIAL PSYCHOLOGY
                </h4>
                <ul className="space-y-2 font-jetbrains text-sm uppercase tracking-wider">
                  <li className="text-muted-foreground">• DYNAMIC SOCIAL PROOF MESSAGING</li>
                  <li className="text-muted-foreground">• ACTIVITY-BASED ENGAGEMENT PROMPTS</li>
                  <li className="text-muted-foreground">• REAL-TIME PAYMENT NOTIFICATIONS</li>
                  <li className="text-muted-foreground">• TRENDING CONTENT INDICATORS</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-20 text-center space-y-6">
          <Card className="brutal-card bg-gradient-brutal text-primary-foreground">
            <CardContent className="p-8">
              <p className="text-lg font-bold uppercase tracking-wider font-space mb-2">
                BUILT WITH NOSTR, LIGHTNING NETWORK, AND MODERN WEB TECHNOLOGIES
              </p>
              <p className="font-jetbrains uppercase tracking-widest text-sm">
                OPEN SOURCE • PRIVACY FOCUSED • DECENTRALIZED
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;