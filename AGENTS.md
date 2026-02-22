# StepOut! - Project Guide for AI Agents

## Project Overview

**StepOut!** is a Dutch-language marketing website for youth adventure travel expeditions. The site targets young people (ages 18-25) in Belgium/The Netherlands, offering 6-day group adventure trips with structured challenges, hitchhiking, and personal growth activities.

The website is a single-page application (SPA) with smooth scrolling sections, featuring a playful pastel color scheme with mint, lavender, and blush tones.

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | ^19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Build Tool | Vite | ^7.2.4 |
| Styling | Tailwind CSS | ^3.4.19 |
| UI Components | shadcn/ui + Radix UI | Latest |
| Icons | Lucide React | ^0.562.0 |
| Forms | React Hook Form + Zod | ^7.70.0, ^4.3.5 |

### Key Dependencies
- **shadcn/ui**: 40+ pre-installed components (accordion, alert-dialog, button, card, dialog, form, etc.)
- **Radix UI Primitives**: Headless accessible components (dropdown, dialog, select, etc.)
- **Tailwind CSS**: Utility-first styling with custom theme
- **Embla Carousel**: For carousels
- **Recharts**: For data visualization/charts
- **date-fns**: Date formatting utilities

---

## Project Structure

```
my-app/
├── src/
│   ├── components/           # Shared components
│   │   ├── Navbar.tsx        # Fixed navigation with smooth scroll
│   │   ├── Footer.tsx        # Footer with social links
│   │   └── ui/               # shadcn/ui components (40+ files)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ... (see info.md for full list)
│   ├── sections/             # Page sections (main content)
│   │   ├── Hero.tsx          # Landing hero with video
│   │   ├── Features.tsx      # 4 feature cards
│   │   ├── About.tsx         # About section
│   │   ├── Testimonial.tsx   # Customer testimonials
│   │   ├── Trips.tsx         # Trip listings
│   │   ├── Gallery.tsx       # Photo gallery
│   │   ├── Pricing.tsx       # Pricing information
│   │   ├── FAQ.tsx           # FAQ accordion
│   │   └── ContactAndSignup.tsx  # Multi-step signup form
│   ├── hooks/                # Custom React hooks
│   │   └── use-mobile.ts     # Mobile breakpoint detection
│   ├── lib/                  # Utilities
│   │   └── utils.ts          # cn() helper for Tailwind classes
│   ├── App.tsx               # Root component
│   ├── App.css               # App-specific styles
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles, CSS variables
├── public/
│   ├── images/               # Static images (~45 files)
│   └── videos/               # Video assets
├── dist/                     # Build output
├── components.json           # shadcn/ui configuration
├── tailwind.config.js        # Tailwind theme configuration
├── vite.config.ts            # Vite build configuration
├── tsconfig.app.json         # TypeScript app config
├── tsconfig.node.json        # TypeScript node config
└── eslint.config.js          # ESLint configuration
```

---

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Build for production
npm run build
# Runs: tsc -b && vite build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

### Development Workflow
1. Run `npm run dev` to start the dev server
2. Edit files in `src/`
3. Changes are hot-reloaded automatically
4. Build with `npm run build` when ready
5. Static files are served from `dist/` folder

---

## Styling Conventions

### Tailwind Configuration
- **Config file**: `tailwind.config.js`
- **CSS file**: `src/index.css`
- **Theme**: Custom pastel color palette (StepOut brand colors)

### Custom Theme Colors (defined in tailwind.config.js)
```javascript
// Custom StepOut colors
mint: { DEFAULT: "#E3FFE4", light: "#F0FFF0", dark: "#C8F5C9" }
lavender: { DEFAULT: "#E3E3FF", light: "#F0F0FF" }
blush: { DEFAULT: "#FDE4F9", light: "#FFF0FD" }
sky: { soft: "#E3F2FF" }
cream: { DEFAULT: "#FFF5C9" }
peach: { DEFAULT: "#FFEEEB" }
purple: { accent: "#7575C8" }
charcoal: "#1D1D1D"
gray: { soft: "#888888" }
```

### CSS Variables (in index.css)
CSS variables follow shadcn/ui conventions:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 11%;
  --primary: 240 5.9% 10%;
  --radius: 0.625rem;
  /* ... see index.css for full list
}
```

### Custom Utility Classes (in index.css)
```css
.section-padding    /* Responsive horizontal padding */
.btn-primary        /* Primary button with shadow effect */
.btn-secondary      /* Secondary outline button */
.card-pastel        /* Pastel card style */
.text-gradient      /* Purple gradient text */
```

### Animation Utilities
- `animate-float` - Floating animation
- `animate-slide-up` - Slide up entrance
- `animate-fade-in` - Fade in animation
- `animation-delay-100` through `500` - Stagger delays

### Class Variance Authority (CVA)
UI components use CVA for variant management:
```typescript
const buttonVariants = cva(
  "base classes...",
  {
    variants: {
      variant: { default: "...", destructive: "..." },
      size: { default: "...", sm: "...", lg: "..." }
    }
  }
)
```

---

## Component Patterns

### shadcn/ui Components
Located in `src/components/ui/`, these follow a consistent pattern:

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Component with variants using CVA
export function Component({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Section Components
Sections in `src/sections/` follow this pattern:

```typescript
import { useEffect, useRef, useState } from 'react';

export default function SectionName() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="section-id" ref={sectionRef} className="...">
      <div className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Content */}
      </div>
    </section>
  );
}
```

### Icon Components
Custom SVG icons are defined inline as components:

```typescript
const TentLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" ...>
    <path d="M20 5L5 35H15L20 25L25 35H35L20 5Z" ... />
  </svg>
);
```

### Form Handling Pattern
The signup form uses controlled inputs with React state:

```typescript
const [formData, setFormData] = useState<FormData>(initialFormData);

const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```

---

## Navigation and Routing

This is a **single-page application** with anchor-based navigation:

```typescript
const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Info', href: '#over-ons' },
  { name: 'Expedities', href: '#reizen' },
  { name: 'Prijs', href: '#prijs' },
  { name: 'Inschrijven', href: '#contact' },
];

// Smooth scroll function
const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
```

---

## Language and Content

- **Primary language**: Dutch (Nederlands)
- **Target audience**: Young Belgians/Dutch speakers, ages 18-25
- **Content focus**: Adventure travel, personal growth, group dynamics
- **Tone**: Friendly, encouraging, adventurous

---

## Import Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

```typescript
// Use @/ prefix for src imports
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
```

---

## Testing

**No testing framework is currently configured.**

To add testing, consider:
- Vitest (matches Vite ecosystem)
- React Testing Library
- Playwright or Cypress for E2E testing

---

## Linting and Code Quality

ESLint is configured with:
- `@eslint/js` - Core ESLint rules
- `typescript-eslint` - TypeScript rules
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - Fast Refresh rules

Run linting: `npm run lint`

---

## Static Assets

### Images
- Location: `public/images/`
- Usage: `/images/filename.jpg`
- Format: Mix of `.jpg` and `.jpeg` files

### Videos
- Location: `public/videos/`
- Usage: `/videos/filename.mp4`
- Currently used: Hero section background video

---

## Build Output

Production build outputs to `dist/`:
```
dist/
├── index.html
├── assets/          # Bundled JS/CSS with hashed filenames
├── images/          # Copied from public/
└── videos/          # Copied from public/
```

---

## Deployment Notes

- This is a static site, can be deployed to any static host
- Vite base path is set to `'./'` in `vite.config.ts` for relative paths
- No server-side rendering (SSR) or API routes

---

## Common Tasks

### Adding a New Section
1. Create `src/sections/NewSection.tsx`
2. Follow the section component pattern (use ref + IntersectionObserver)
3. Add route ID for anchor navigation
4. Import and add to `App.tsx`

### Adding a New UI Component
Option 1 - Use shadcn CLI (if available):
```bash
npx shadcn add component-name
```

Option 2 - Create manually in `src/components/ui/`:
- Follow existing component patterns
- Use CVA for variants
- Export from index if needed

### Adding Custom Colors
1. Add to `tailwind.config.js` in the `extend.colors` section
2. Can use HSL, hex, or RGB values
3. Access via Tailwind classes: `bg-mint`, `text-purple-accent`

### Modifying Navigation
Edit `src/components/Navbar.tsx`:
- Update `navLinks` array for menu items
- Update mobile menu rendering

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component, renders all sections |
| `src/main.tsx` | React entry point |
| `src/index.css` | Global styles, CSS variables, custom utilities |
| `tailwind.config.js` | Theme configuration, colors, animations |
| `components.json` | shadcn/ui configuration |
| `vite.config.ts` | Vite plugins, aliases, base path |
| `src/lib/utils.ts` | `cn()` utility for Tailwind class merging |
