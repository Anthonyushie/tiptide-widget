# Tiptide Widget 🌊⚡

> **Real-time Nostr Zap Widget for Lightning Network Tips**

A modern, embeddable React widget that displays real-time Lightning Network zap data from the Nostr protocol. Perfect for content creators, bloggers, and developers who want to showcase social proof and encourage Lightning tips.

![Tiptide Widget Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Lightning](https://img.shields.io/badge/Lightning-F7931E?logo=lightning&logoColor=white) ![Nostr](https://img.shields.io/badge/Nostr-8B5CF6?logo=nostr&logoColor=white)

## 🚀 Features

- **⚡ Real-time Lightning Zaps** - Live tracking of Lightning Network payments via Nostr relays
- **🔥 Social Proof Psychology** - Dynamic messaging that adapts based on payment activity
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **🎨 Customizable Themes** - Brutal design system with Bitcoin-inspired styling
- **🔌 Easy Integration** - Drop-in React component with minimal setup
- **🌐 Multi-Relay Support** - Connects to 20+ Nostr relays for maximum reliability
- **📊 Real-time Analytics** - Live payment statistics and activity feeds
- **🎭 Demo Mode** - Built-in demo with simulated data for testing

## 🎯 Use Cases

- **Content Creator Tips** - Display real-time zaps on blog posts and articles
- **Social Media Integration** - Show Lightning tip activity on social platforms
- **Event Fundraising** - Real-time donation tracking for events and causes
- **Product Launches** - Social proof for new product announcements
- **Community Building** - Encourage engagement through visible tip activity

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Basic knowledge of React/TypeScript

### Installation

```bash
# Clone the repository
git clone https://github.com/Anthonyushie/tiptide-widget.git

# Navigate to project directory
cd tiptide-widget

# Install dependencies
npm install

# Start development server
npm run dev
```

### Basic Usage

```tsx
import { TiptideWidget } from '@/components/TiptideWidget';

function MyComponent() {
  return (
    <TiptideWidget
      postId="note1a0tfjua3mdk3e5u2cd709nu9qszhzj8a2mnwp9xwyk2dymzujtmq56vcvv"
      demoMode={false}
      showRealtimeActivity={true}
      compactMode={false}
    />
  );
}
```

## 📖 API Reference

### TiptideWidget Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `postId` | `string` | **required** | Nostr note ID (note1... or hex format) |
| `relays` | `string[]` | `DEFAULT_RELAYS` | Array of Nostr relay URLs |
| `demoMode` | `boolean` | `false` | Enable demo mode with simulated data |
| `showRealtimeActivity` | `boolean` | `true` | Show real-time payment activity feed |
| `compactMode` | `boolean` | `false` | Use compact layout for smaller spaces |
| `className` | `string` | `""` | Additional CSS classes |

### Example Configurations

#### Full Widget (Default)
```tsx
<TiptideWidget
  postId="note1..."
  showRealtimeActivity={true}
  compactMode={false}
/>
```

#### Compact Mode
```tsx
<TiptideWidget
  postId="note1..."
  compactMode={true}
  showRealtimeActivity={false}
/>
```

#### Demo Mode
```tsx
<TiptideWidget
  postId="demo-post-id"
  demoMode={true}
/>
```

#### Custom Relays
```tsx
<TiptideWidget
  postId="note1..."
  relays={[
    'wss://relay.damus.io',
    'wss://relay.primal.net',
    'wss://nostr-01.yakihonne.com'
  ]}
/>
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

```env
# Optional: Custom relay endpoints
VITE_CUSTOM_RELAYS=wss://your-relay.com,wss://another-relay.com

# Optional: Default demo mode
VITE_DEFAULT_DEMO_MODE=false

# Optional: Connection timeout (ms)
VITE_CONNECTION_TIMEOUT=20000
```

### Relay Configuration

The widget connects to multiple Nostr relays for maximum reliability:

#### Primary Relays
- **relay.damus.io** - Primary relay with high uptime
- **relay.primal.net** - High-performance relay
- **relay.snort.social** - Social-focused relay

#### Yakihonne Relays
- **nostr-01.yakihonne.com** - Yakihonne community relay #1 ⚡
- **nostr-02.yakihonne.com** - Yakihonne community relay #2 ⚡

#### Additional Relays
- **nos.lol** - Community relay
- **relay.nostr.band** - Analytics relay
- **purplepag.es** - Purple Pages relay
- **nostr.wine** - Wine relay
- **relay.mostr.pub** - Mostr bridge relay
- And 15+ more for maximum coverage

The widget automatically connects to the first 10 available relays for optimal performance.

## 🎨 Styling & Theming

### CSS Classes

The widget uses a "brutal design" system with these key classes:

```css
/* Main container */
.brutal-card { /* Card styling */ }
.brutal-border { /* Border styling */ }
.brutal-shadow { /* Shadow effects */ }

/* Bitcoin theme */
.gradient-text-bitcoin { /* Bitcoin gradient text */ }
.bg-bitcoin { /* Bitcoin background */ }
.border-bitcoin { /* Bitcoin border */ }

/* Typography */
.font-space { /* Space Grotesk font */ }
.font-jetbrains { /* JetBrains Mono font */ }

/* Animations */
.animate-pulse-glow { /* Glowing pulse effect */ }
.animate-subtle-bounce { /* Subtle bounce animation */ }
```

### Custom Styling

```tsx
<TiptideWidget
  postId="note1..."
  className="my-custom-widget"
/>
```

```css
.my-custom-widget {
  --accent: 255 165 0; /* Custom orange accent */
  --bitcoin: 247 147 30; /* Custom bitcoin color */
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 🔌 Integration Examples

### Next.js Integration

```tsx
// components/TiptideWidget.tsx
import dynamic from 'next/dynamic';

const TiptideWidget = dynamic(
  () => import('@/components/TiptideWidget').then(mod => ({ default: mod.TiptideWidget })),
  { ssr: false }
);

export default function BlogPost({ noteId }: { noteId: string }) {
  return (
    <div>
      <h1>My Blog Post</h1>
      <p>Content here...</p>
      
      <TiptideWidget
        postId={noteId}
        compactMode={true}
      />
    </div>
  );
}
```

### WordPress Integration

```php
// functions.php
function enqueue_tiptide_widget() {
    wp_enqueue_script('tiptide-widget', 'path/to/tiptide-widget.js', [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_tiptide_widget');

// In your template
echo '<div id="tiptide-widget" data-note-id="note1..."></div>';
```

### Static HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
    <div id="tiptide-widget"></div>
    <script src="./tiptide-widget.js"></script>
    <script>
        TiptideWidget.render({
            postId: 'note1...',
            compactMode: true
        }, document.getElementById('tiptide-widget'));
    </script>
</body>
</html>
```

## 🧪 Development

### Project Structure

```
src/
├── components/
│   ├── TiptideWidget.tsx      # Main widget component
│   ├── PaymentStatsDisplay.tsx # Payment statistics
│   ├── SocialProofMessage.tsx  # Social proof messaging
│   ├── RealtimeActivity.tsx    # Activity feed
│   └── ui/                     # UI components
├── hooks/
│   └── useNostrData.ts        # Nostr data fetching hook
├── lib/
│   └── nostr.ts               # Nostr client implementation
├── types/
│   └── nostr.ts               # TypeScript definitions
└── pages/
    └── Index.tsx              # Demo page
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests (if configured)
```

### Building for Production

```bash
# Build the widget
npm run build

# The built files will be in the `dist/` directory
# Include these files in your project:
# - dist/assets/index.js (main bundle)
# - dist/assets/index.css (styles)
```

## 🔍 Troubleshooting

### Common Issues

#### Widget Not Loading
```bash
# Check console for errors
# Ensure postId is valid Nostr note ID
# Verify relay connections in browser dev tools
```

#### No Zap Data Showing
```bash
# Try demo mode first: demoMode={true}
# Check if the note ID has any zaps
# Verify relay connectivity
# Check browser console for WebSocket errors
```

#### Styling Issues
```bash
# Ensure Tailwind CSS is properly configured
# Check for CSS conflicts
# Verify custom CSS class names
```

### Debug Mode

Enable debug logging:

```tsx
<TiptideWidget
  postId="note1..."
  // Add this to see detailed logs
  debug={true}
/>
```

### Relay Connection Issues

If relays are failing to connect:

1. Check browser console for WebSocket errors
2. Try with demo mode to verify widget functionality
3. Test with different relay configurations
4. Ensure your network allows WebSocket connections

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork the repository
git clone https://github.com/your-username/tiptide-widget.git
cd tiptide-widget

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and test
npm run dev

# Submit a pull request
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for public APIs
- Include tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nostr Protocol** - Decentralized social media protocol
- **Lightning Network** - Bitcoin's layer 2 payment solution
- **nostr-tools** - JavaScript library for Nostr
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

- **GitHub Issues** - [Report bugs or request features](https://github.com/Anthonyushie/tiptide-widget/issues)
- **Documentation** - [Full documentation](https://github.com/Anthonyushie/tiptide-widget/wiki)
- **Community** - [Join our Discord](https://discord.gg/your-discord)

## 🚀 Deployment

### Lovable Platform

This project is built with [Lovable](https://lovable.dev):

1. Visit the [Lovable Project](https://lovable.dev/projects/24018d13-e326-4c90-9dbc-3a3c177ce4a1)
2. Click Share → Publish to deploy
3. Connect a custom domain in Project → Settings → Domains

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to your hosting platform
# The `dist/` folder contains all static files
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

**Built with ⚡ by the Tiptide team** | **Powered by Nostr & Lightning Network**
