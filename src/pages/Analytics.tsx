import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AnalyticsProps {
  onBackToWidget?: () => void;
}

const Analytics = ({ onBackToWidget }: AnalyticsProps) => {
  const handleBackClick = () => {
    if (onBackToWidget) {
      onBackToWidget();
    } else {
      // Fallback to history back
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--accent)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-accent/20 rotate-45 animate-subtle-bounce" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-bitcoin/10 border-4 border-bitcoin/30 rotate-12 animate-subtle-bounce" />
        <div className="absolute bottom-32 left-32 w-20 h-20 border-4 border-success/20 -rotate-12 animate-subtle-bounce" />
        <div className="absolute top-60 left-1/2 w-16 h-16 bg-accent/5 border-4 border-accent/20 rotate-45 animate-subtle-bounce" />
        <div className="absolute bottom-20 right-20 w-28 h-28 border-4 border-bitcoin/15 -rotate-45 animate-subtle-bounce" />
        
        {/* Lightning Bolt Shapes */}
        <div className="absolute top-32 right-1/4 text-6xl text-accent/10 animate-pulse-glow">⚡</div>
        <div className="absolute bottom-40 left-1/4 text-4xl text-bitcoin/20 animate-pulse-glow">⚡</div>
        <div className="absolute top-1/2 right-16 text-5xl text-success/10 animate-pulse-glow">⚡</div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="brutal-card-accent p-8 text-center">
            <h1 className="text-5xl font-bold mb-4 gradient-text-bitcoin font-space">
              Analytics Dashboard
            </h1>
            <p className="text-xl font-jetbrains text-muted-foreground">
              Deep insights into Lightning Network zap activity
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-accent/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-2 font-jetbrains">
                1,247
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Total Zaps
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-bitcoin/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-bitcoin mb-2 font-jetbrains">
                89.2K
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Total Sats
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-success/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-success mb-2 font-jetbrains">
                156
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Active Posts
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-info/10">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-info mb-2 font-jetbrains">
                23
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Relays Connected
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Zap Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                Zap Activity Over Time
                <Badge variant="accent" className="font-jetbrains">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 brutal-border bg-muted/20 brutal-shadow-sm rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="font-jetbrains text-muted-foreground">
                    Interactive Chart Area
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="brutal-border bg-card p-4 brutal-shadow-sm rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold font-jetbrains text-sm">
                          Post #{i} - Derek Ross
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          note1a0tfjua3mdk3e5u2cd709nu9...
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-bitcoin font-jetbrains">
                          {(Math.random() * 50 + 10).toFixed(0)}K
                        </div>
                        <div className="text-xs text-muted-foreground">
                          sats
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 brutal-border bg-muted/20 brutal-shadow-sm rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌍</div>
                  <div className="font-jetbrains text-sm text-muted-foreground">
                    World Map
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Sizes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Payment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { range: '1-10 sats', percentage: 45, color: 'bg-accent' },
                  { range: '11-100 sats', percentage: 35, color: 'bg-bitcoin' },
                  { range: '101-1K sats', percentage: 15, color: 'bg-success' },
                  { range: '1K+ sats', percentage: 5, color: 'bg-info' }
                ].map((item) => (
                  <div key={item.range} className="space-y-1">
                    <div className="flex justify-between text-sm font-jetbrains">
                      <span>{item.range}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted brutal-border brutal-shadow-sm rounded-sm overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="brutal-border bg-card p-3 brutal-shadow-sm rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-accent rounded-full animate-pulse-glow" />
                        <div className="text-sm font-jetbrains">
                          {(Math.random() * 1000 + 100).toFixed(0)} sats
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-jetbrains">
                        {i}m ago
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Relay Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Relay Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  'nostr-01.yakihonne.com',
                  'nostr-02.yakihonne.com',
                  'relay.damus.io',
                  'relay.primal.net'
                ].map((relay) => (
                  <div key={relay} className="brutal-border bg-card p-4 brutal-shadow-sm rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-jetbrains text-sm font-semibold">
                        {relay}
                      </div>
                      <Badge variant="success" className="font-jetbrains text-xs">
                        ✅ Online
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground font-jetbrains">
                      <span>Latency: {(Math.random() * 100 + 50).toFixed(0)}ms</span>
                      <span>Events: {(Math.random() * 1000 + 500).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Export & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="brutal-border bg-accent/10 p-4 brutal-shadow-accent rounded-md">
                <h4 className="font-bold mb-2 text-accent font-space">
                  Data Export
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full font-jetbrains">
                    Export CSV
                  </Button>
                  <Button variant="outline" className="w-full font-jetbrains">
                    Export JSON
                  </Button>
                </div>
              </div>
              
              <div className="brutal-border bg-bitcoin/10 p-4 brutal-shadow-bitcoin rounded-md">
                <h4 className="font-bold mb-2 text-bitcoin font-space">
                  Settings
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full font-jetbrains">
                    Configure Alerts
                  </Button>
                  <Button variant="outline" className="w-full font-jetbrains">
                    API Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
          {/* Main Coming Soon Message */}
          <div className="brutal-card-accent p-12">
            <div className="text-8xl mb-6 animate-pulse-glow">⚡</div>
            <h1 className="text-6xl font-bold mb-6 gradient-text-bitcoin font-space">
              Coming Soon
            </h1>
            <p className="text-2xl font-jetbrains text-muted-foreground mb-8">
              Advanced analytics dashboard is under development
            </p>
            
            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="brutal-border bg-accent/20 p-4 brutal-shadow-accent rounded-md">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-bold font-space text-sm">
                  Real-time Charts
                </div>
              </div>
              <div className="brutal-border bg-bitcoin/20 p-4 brutal-shadow-bitcoin rounded-md">
                <div className="text-3xl mb-2">🌍</div>
                <div className="font-bold font-space text-sm">
                  Global Insights
                </div>
              </div>
              <div className="brutal-border bg-success/20 p-4 brutal-shadow-sm rounded-md">
                <div className="text-3xl mb-2">📈</div>
                <div className="font-bold font-space text-sm">
                  Trend Analysis
                </div>
              </div>
            </div>
            
            <div className="brutal-border bg-muted/20 p-6 brutal-shadow-sm rounded-md">
              <p className="font-jetbrains text-sm text-muted-foreground">
                Get notified when analytics goes live • Advanced Nostr data visualization • Lightning Network insights
              </p>
            </div>
          </div>
          
          {/* Back Button */}
          <Button 
            variant="bitcoin" 
            size="lg" 
            className="font-jetbrains text-lg"
            onClick={handleBackClick}
          >
            ← Back to Widget Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;