# 🚀 Tiptide - Yakihonne Smart Widget

> **Lightning Network Zap Widget for Nostr** - A modern, responsive web application that displays real-time Lightning Network tips (zaps) from Nostr posts with enhanced Yakihonne integration.

[![Responsive Design](https://img.shields.io/badge/Design-Fully%20Responsive-brightgreen)](#-responsive-design)
[![Nostr Protocol](https://img.shields.io/badge/Protocol-Nostr-purple)](https://nostr.com)
[![Lightning Network](https://img.shields.io/badge/Network-Lightning-orange)](https://lightning.network)
[![Yakihonne Integration](https://img.shields.io/badge/Integration-Yakihonne-blue)](https://yakihonne.com)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Component Architecture](#-component-architecture)
- [Responsive Design](#-responsive-design)
- [Nostr Integration](#-nostr-integration)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Tiptide** is a sophisticated Lightning Network zap widget designed specifically for the Nostr ecosystem, with enhanced integration for Yakihonne platforms. It provides real-time visualization of Bitcoin tips (zaps) sent to Nostr posts, complete with analytics, geographic distribution mapping, and social proof messaging.

### 🌟 Key Highlights

- **🔥 Real-time Zap Tracking**: Live monitoring of Lightning Network payments to Nostr posts
- **⚡ Yakihonne Priority**: Enhanced integration with Yakihonne relay infrastructure
- **🌍 Global Analytics**: Interactive world map showing zap distribution across countries
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop experiences
- **🎨 Modern UI/UX**: Brutalist design system with Bitcoin-inspired aesthetics
- **📊 Rich Analytics**: Comprehensive dashboard with payment statistics and trends

---

## ✨ Features

### Core Functionality
- ✅ **Live Zap Monitoring** - Real-time tracking of Lightning payments
- ✅ **Multi-Relay Support** - Connected to 30+ high-quality Nostr relays
- ✅ **Yakihonne Integration** - Priority connection to 4 Yakihonne relays
- ✅ **Demo Mode** - Interactive demo with simulated zap data
- ✅ **Compact Widget Mode** - Space-efficient display option
- ✅ **Social Proof Messages** - Dynamic encouragement based on activity

### Analytics Dashboard
- 📊 **Interactive World Map** - Global zap activity visualization
- 📈 **Payment Statistics** - Total amounts, counts, and averages
- 🌐 **Relay Performance** - Connection status and latency monitoring
- 📱 **Mobile-First Design** - Optimized for all screen sizes
- 🎯 **Top Performing Posts** - Leaderboard of most-zapped content

### User Experience
- 🎨 **Brutalist Design System** - Bold, accessible interface
- 🌙 **Dark/Light Mode** - Automatic theme switching
- ⚡ **Lightning-Fast** - Optimized performance and loading
- 🔄 **Real-time Updates** - Live data without page refreshes
- 📲 **Touch-Friendly** - Mobile-optimized interactions

---

## 🛠 Technology Stack

### Frontend Framework
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast build tool and dev server

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library
- **Custom Design System** - Bitcoin and Nostr-themed components
- **Responsive Grid** - Mobile-first responsive layouts

### Nostr & Lightning
- **nostr-tools** - Nostr protocol implementation
- **WebSocket Connections** - Real-time relay communication
- **Lightning Network** - Bitcoin payment integration
- **Zap Event Processing** - Lightning payment parsing

### State Management
- **React Hooks** - useState, useEffect, useContext
- **Custom Hooks** - useNostrData, useToast
- **Local State** - Component-level state management

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- Modern web browser with WebSocket support

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
tiptide/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn/UI components
│   │   ├── TiptideWidget.tsx # Main widget component
│   │   ├── PaymentStatsDisplay.tsx
│   │   ├── RealtimeActivity.tsx
│   │   ├── SocialProofMessage.tsx
│   │   ├── WorldMapAnimation.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Home page with widget demo
│   │   ├── Analytics.tsx    # Analytics dashboard
│   │   └── NotFound.tsx     # 404 page
│   ├── hooks/               # Custom React hooks
│   │   ├── useNostrData.ts  # Nostr data fetching
│   │   └── use-toast.ts     # Toast notifications
│   ├── lib/                 # Utility libraries
│   │   ├── nostr.ts         # Nostr protocol utilities
│   │   └── utils.ts         # General utilities
│   ├── types/               # TypeScript definitions
│   │   └── nostr.ts         # Nostr-related types
│   ├── assets/              # Static assets
│   ├── index.css            # Global styles and design system
│   └── main.tsx             # Application entry point
├── public/                  # Static public files
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Project dependencies
```

---

## 🏗 Component Architecture

### Core Components

#### `TiptideWidget` - Main Widget Component
- **Purpose**: Primary widget displaying zap statistics and activity
- **Features**: Demo mode, compact mode, real-time updates
- **Props**: `postId`, `relays`, `demoMode`, `compactMode`

#### `PaymentStatsDisplay` - Statistics Component
- **Purpose**: Shows total amounts, counts, and averages
- **Features**: Loading states, formatted numbers, responsive layout
- **Props**: `stats`, `loading`, `compact`

#### `RealtimeActivity` - Activity Feed
- **Purpose**: Displays recent zap activity with animations
- **Features**: Scrolling feed, emoji reactions, time formatting
- **Props**: `payments`, `showActivity`

#### `WorldMapAnimation` - Geographic Visualization
- **Purpose**: Interactive world map showing global zap distribution
- **Features**: SVG animation, hover tooltips, connection flows
- **Props**: No external props (self-contained)

### Page Components

#### `Index` - Home Page
- **Purpose**: Main landing page with widget demo
- **Features**: Hero section, multiple post examples, configuration
- **Responsive**: Mobile-first design with adaptive layouts

#### `Analytics` - Dashboard Page
- **Purpose**: Comprehensive analytics and insights
- **Features**: Charts, statistics, geographic data, relay performance
- **Responsive**: Grid layouts optimized for all screen sizes

---

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Grid Systems**: Responsive grids that adapt to screen size
- **Typography**: Scalable text sizes using Tailwind responsive prefixes
- **Touch Targets**: Minimum 44px touch targets for mobile interaction

### Key Responsive Features
- **Adaptive Hero Section**: Scaled typography and reduced animations on mobile
- **Flexible Card Layouts**: Single column on mobile, multi-column on desktop
- **Optimized Navigation**: Mobile-friendly button sizes and spacing
- **Compact Widget Mode**: Space-efficient display for smaller screens

### Design System Tokens
```css
/* Mobile-first responsive spacing */
.container {
  @apply px-3 sm:px-6 py-3 sm:py-6;
}

/* Responsive typography */
.heading {
  @apply text-xl sm:text-3xl md:text-4xl lg:text-5xl;
}

/* Adaptive grids */
.stats-grid {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6;
}
```

---

## ⚡ Nostr Integration

### Relay Configuration
The application connects to multiple Nostr relays with Yakihonne prioritization:

#### Yakihonne Relays (Priority)
- `wss://nostr-01.yakihonne.com`
- `wss://nostr-02.yakihonne.com`
- `wss://nostr-03.yakihonne.com`
- `wss://nostr-04.yakihonne.com`

#### High-Performance Relays
- `wss://relay.damus.io`
- `wss://relay.primal.net`
- `wss://relay.snort.social`
- `wss://nos.lol`
- And 20+ additional reliable relays

### Event Processing
```typescript
// Zap event structure
interface PaymentData {
  id: string;
  eventId: string;
  amount: number;      // Amount in millisatoshis
  timestamp: number;   // Unix timestamp
  message?: string;    // Optional zap message
}
```

### Real-time Data Flow
1. **Connection**: WebSocket connections to multiple relays
2. **Subscription**: Subscribe to zap events for specific posts
3. **Processing**: Parse and validate incoming zap events
4. **Aggregation**: Calculate statistics and recent activity
5. **Display**: Update UI with real-time data

---

## ⚙️ Configuration

### Widget Configuration
```typescript
interface TiptideConfig {
  postId: string;                    // Nostr note ID to track
  relays: string[];                  // Array of relay URLs
  demoMode?: boolean;                // Enable demo mode
  showRealtimeActivity?: boolean;    // Show activity feed
  compactMode?: boolean;             // Compact display mode
  className?: string;                // Additional CSS classes
}
```

### Customizing Relays
```typescript
const customRelays = [
  'wss://your-relay.com',
  'wss://another-relay.com',
  ...enhancedRelays  // Include default relays
];
```

---

## 🔧 Development

### Development Server
```bash
npm run dev
```
- Hot reload enabled
- TypeScript checking
- Tailwind CSS compilation
- Available at `http://localhost:5173`

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

---

## 🚀 Deployment

### Using Lovable (Recommended)
Simply open [Lovable](https://lovable.dev/projects/24018d13-e326-4c90-9dbc-3a3c177ce4a1) and click on Share → Publish.

### Static Hosting
The app is a static React application that can be deployed to any static hosting service:

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

#### GitHub Pages
```bash
npm run build
# Upload dist/ contents to gh-pages branch
```

### Custom Domain
To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## 🤝 Contributing

We welcome contributions to improve Tiptide! Here's how to get started:

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone <YOUR_GIT_URL>`
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/amazing-feature`
5. Make changes and test thoroughly
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style
- Follow existing TypeScript and React patterns
- Use Tailwind CSS for styling (no inline styles)
- Maintain mobile-first responsive design
- Add proper TypeScript types for new features
- Follow the established component structure

### Areas for Contribution
- 🎨 **UI/UX Improvements**: Enhanced animations and interactions
- 📊 **Analytics Features**: Additional charts and visualizations
- ⚡ **Lightning Integration**: Direct payment functionality
- 🌍 **Internationalization**: Multi-language support
- 🔧 **Performance**: Optimization and caching improvements
- 🧪 **Testing**: Comprehensive test coverage

---

## 📞 Support & Contact

**Project URL**: https://lovable.dev/projects/24018d13-e326-4c90-9dbc-3a3c177ce4a1

### How to Edit This Code

#### Use Lovable
Simply visit the [Lovable Project](https://lovable.dev/projects/24018d13-e326-4c90-9dbc-3a3c177ce4a1) and start prompting. Changes made via Lovable will be committed automatically to this repo.

#### Use Your Preferred IDE
Clone this repo and push changes. Pushed changes will also be reflected in Lovable.

#### GitHub Codespaces
Navigate to the main page of your repository, click "Code" → "Codespaces" → "New codespace".

---

**⚡ Built with Lightning ⚡**

*Tiptide is part of the growing ecosystem of Lightning-enabled applications that make Bitcoin payments instant, cheap, and global. Join the revolution of decentralized money and communication.*

---

<div align="center">
  
**[⬆ Back to Top](#-tiptide---yakihonne-smart-widget)**

Made with ⚡ by the Nostr community

</div>