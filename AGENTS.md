# StepOut! - Project Guide for AI Agents

## Project Overview

**StepOut!** is a Dutch-language marketing and registration website for youth adventure travel expeditions. The site targets young people (ages 18-25) in Belgium/The Netherlands, offering 6-day group adventure trips with structured challenges, hitchhiking, and personal growth activities.

The application consists of:
- **Public Website**: A single-page marketing site with smooth scrolling sections showcasing trips, pricing, FAQ, and a multi-step registration form
- **Admin Dashboard**: A protected interface for administrators to view and manage trip registrations (inschrijvingen)

**Hosting**: The site is deployed and hosted on **GitHub Pages** with automated CI/CD via GitHub Actions.

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | ^19.2.0 |
| Language | TypeScript | ~5.9.3 |
| Build Tool | Vite | ^7.2.4 |
| Routing | React Router DOM | ^7.13.1 (HashRouter) |
| Styling | Tailwind CSS | ^3.4.19 |
| UI Components | shadcn/ui + Radix UI | Latest |
| Backend/Auth | Supabase | ^2.97.0 |
| Icons | Lucide React | ^0.562.0 |
| Forms | React Hook Form + Zod | ^7.70.0, ^4.3.5 |
| Carousel | Embla Carousel | ^8.6.0 |
| Charts | Recharts | ^2.15.4 |
| Date Utils | date-fns | ^4.1.0 |

### Key Dependencies
- **@radix-ui/react-\\\\\\*\\***: 25+ headless UI primitives (accordion, dialog, dropdown, etc.)
- **shadcn/ui**: 40+ pre-installed components in `src/components/ui/`
- **tailwindcss-animate**: Animation utilities
- **class-variance-authority**: Component variant management
- **clsx + tailwind-merge**: Conditional class merging via `cn()` utility

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx           # Fixed navigation with smooth scroll anchors
│   ├── Footer.tsx           # Footer with social links
│   ├── admin/               # Admin-specific components
│   │   ├── EmptyState.tsx
│   │   ├── InschrijvingDetail.tsx
│   │   ├── InschrijvingList.tsx
│   │   └── MediaViewer.tsx
│   ├── auth/
│   │   └── ProtectedRoute.tsx   # Route guard for admin routes
│   └── ui/                  # shadcn/ui components (40+ files)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       └── ... (see full list below)
├── contexts/
│   └── AuthContext.tsx      # Supabase auth state management
├── hooks/
│   ├── use-mobile.ts        # Mobile breakpoint detection
│   └── useFormSubmit.ts     # Form submission with file upload logic
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   ├── utils.ts             # cn() helper for Tailwind classes
│   └── validation.ts        # Zod schemas for form validation
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx   # Protected admin interface
│       └── AdminLogin.tsx       # Admin authentication page
├── sections/                # Public website page sections
│   ├── Hero.tsx             # Landing hero with video background
│   ├── About.tsx            # About section
│   ├── Features.tsx         # 4 feature cards
│   ├── Testimonial.tsx      # Customer testimonials
│   ├── Trips.tsx            # Trip listings
│   ├── Gallery.tsx          # Photo gallery
│   ├── Pricing.tsx          # Pricing information
│   ├── FAQ.tsx              # FAQ accordion
│   ├── ContactAndSignup.tsx # Multi-step signup form (main component)
│   ├── CTA.tsx              # Call-to-action section
│   ├── Stats.tsx            # Statistics display
│   └── SignupForm.tsx       # Form section wrapper
├── services/
│   └── inschrijvingenService.ts   # Supabase database operations
├── types/
│   ├── auth.ts              # Auth-related TypeScript types
│   └── inschrijving.ts      # Registration form data types
├── App.tsx                  # Root component with routing
├── App.css                  # App-specific styles
├── main.tsx                 # React entry point
└── index.css                # Global styles, CSS variables, fonts

public/
├── images/                  # Static images (~45 files)
└── videos/                  # Video assets (hero background)

dist/                        # Build output (Vite)
```


## Routing Architecture

The application uses **HashRouter** (instead of BrowserRouter) for GitHub Pages compatibility:

```typescript
// App.tsx
<HashRouter>
  <Routes>
    {/* Public website */}
    <Route path="/" element={<MainWebsite />} />
    
    {/* Admin routes */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    
    {/* Catch all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</HashRouter>
```

### Public Website Navigation
Single-page with anchor-based smooth scrolling:
- `#home` - Hero section
- `#over-ons` - About section
- `#reizen` - Trips section
- `#prijs` - Pricing section
- `#contact` - Contact/Signup section

---

## Backend & Database (Supabase)

### Configuration
```typescript
// src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**Environment Variables** (in `.env.local`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public API key

### Database Schema

**Table: `inschrijvingen`** (Registrations)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | Creation time |
| naam | text | Full name |
| leeftijd | int | Age (18-25) |
| woonplaats | text | City |
| gsm | text | Phone number |
| email | text | Email address |
| instagram | text | Instagram handle (optional) |
| beschikbaarheid | text[] | Available date ranges |
| motivatie | text | Motivation letter |
| doelen | text[] | Selected goals (max 2) |
| persoonlijkheid | text[] | Personality traits (max 3) |
| groepsrol | text | Group role preference |
| spannendst | text | Most exciting aspect |
| ongemakkelijk | text | Uncomfortable situations |
| waarom_passen | text | Why they fit |
| wat_spreekt_aan | text | What appeals to them |
| sportiviteit | text | Fitness level |
| sociale_interactie | text | Social preference |
| zelfstandigheid | text | Independence level |
| medisch | boolean | Medical conditions |
| medisch_uitleg | text | Medical explanation |
| noodcontact_naam | text | Emergency contact name |
| noodcontact_gsm | text | Emergency contact phone |
| foto_url | text | Photo file path |
| video_url | text | Video file path |
| status | enum | 'nieuw' | 'beoordeeld' | 'goedgekeurd' | 'afgewezen' |
| notities | text | Admin notes |

**Storage Bucket: `uploads`**
- `photos/` - Profile pictures
- `videos/` - Introduction videos
- **Access Control**: Only authenticated users (admins) can access files in the storage bucket. Files are uploaded via the public registration form, but retrieval requires admin authentication.

---

## Styling Conventions

### Tailwind Configuration (`tailwind.config.js`)

**Custom Brand Colors:**
```javascript
colors: {
  mint: { DEFAULT: "#E3FFE4", light: "#F0FFF0", dark: "#C8F5C9" },
  lavender: { DEFAULT: "#E3E3FF", light: "#F0F0FF" },
  blush: { DEFAULT: "#FDE4F9", light: "#FFF0FD" },
  sky: { soft: "#E3F2FF" },
  cream: { DEFAULT: "#FFF5C9" },
  peach: { DEFAULT: "#FFEEEB" },
  purple: { accent: "#7575C8" },
  charcoal: "#1D1D1D",
  gray: { soft: "#888888" },
}
```

**Custom Fonts:**
- `font-sans`: DM Sans, Inter, system-ui
- `font-display`: Cabinet Grotesk, DM Sans

### CSS Variables (`src/index.css`)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 11%;
  --primary: 240 5.9% 10%;
  --secondary: 120 100% 95%;
  --radius: 0.625rem;
  /* ... shadcn/ui standard variables */
}
```

### Custom Utility Classes (`@layer components`)

```css
.section-padding    /* Responsive horizontal padding */
.btn-primary        /* Primary button with shadow effect */
.btn-secondary      /* Secondary outline button */
.card-pastel        /* Pastel card style */
.text-gradient      /* Purple gradient text */
```

### Animation Utilities

```css
.animate-float      /* Floating animation (3s infinite) */
.animate-slide-up   /* Slide up entrance */
.animate-fade-in    /* Fade in animation */
.animation-delay-100 through 500  /* Stagger delays */
```

---

## Component Patterns

### shadcn/ui Components
All UI components follow this pattern:

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva("base classes...", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." }
  }
})

export function Component({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Section Components Pattern
Sections use IntersectionObserver for scroll animations:

```typescript
export default function SectionName() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="section-id" ref={sectionRef}>
      <div className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Content */}
      </div>
    </section>
  );
}
```

### Form Handling Pattern
Forms use a custom hook pattern with Zod validation:

```typescript
// src/hooks/useFormSubmit.ts
const { submitForm, isSubmitting, isSuccess, isError, error, uploadProgress } = useFormSubmit();

// src/lib/validation.ts
export const signupFormSchema = z.object({
  naam: z.string().min(2, 'Naam moet minstens 2 karakters bevatten'),
  // ... more fields
});
```

---

## Code Style Guidelines

### TypeScript Configuration
- Target: ES2022
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- No unused locals/parameters allowed

### Import Order
1. React imports
2. Third-party libraries
3. Absolute imports (`@/components`, `@/lib`, etc.)
4. Relative imports
5. Type imports

### Naming Conventions
- Components: PascalCase (`InschrijvingDetail.tsx`)
- Hooks: camelCase starting with `use` (`useFormSubmit.ts`)
- Utilities: camelCase (`utils.ts`)
- Types/Interfaces: PascalCase (`Inschrijving`, `AuthState`)

### File Organization
- One component per file (default export)
- Types in dedicated `types/` folder
- Services in dedicated `services/` folder
- Reusable logic in `hooks/` folder

---

## Language and Content

- **Primary language**: Dutch (Nederlands)
- **Target audience**: Young Belgians/Dutch speakers, ages 18-25
- **Content tone**: Friendly, encouraging, adventurous
- **Key terms**:
  - "Inschrijving" = Registration
  - "Expeditie" = Expedition/Trip
  - "Liften" = Hitchhiking

---

## Testing

**No testing framework is currently configured.**

To add testing, consider:
- Vitest (matches Vite ecosystem)
- React Testing Library
- Playwright or Cypress for E2E testing

---

## Linting and Code Quality

ESLint configuration (`eslint.config.js`):
- `@eslint/js` - Core ESLint rules
- `typescript-eslint` - TypeScript rules
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - Fast Refresh rules

Run linting:
```bash
npm run lint
```

---

## Deployment

### GitHub Pages (Current Setup)

**Workflow file**: `.github/workflows/deploy.yml`

Automated deployment on push to `main` branch:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Build (`npm run build`)
5. Deploy `dist/` folder to GitHub Pages

**Manual trigger**: Available via GitHub Actions UI

### Build Output Structure
```
dist/
├── index.html
├── assets/          # Bundled JS/CSS with hashed filenames
├── images/          # Copied from public/
└── videos/          # Copied from public/
```

### Important Deployment Notes
- Uses **HashRouter** for client-side routing (required for GitHub Pages)
- Vite base path is set to `'/'` in `vite.config.ts`
- Supabase credentials are baked into the build via fallback values

---

## Security Considerations

### Content Security Policy (`index.html`)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  font-src 'self' https://fonts.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  script-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://lrdjjzlodcazirutcruj.supabase.co;
  media-src 'self';
  frame-src 'none';
  object-src 'none';
">
```

### Authentication
- Supabase Auth with session persistence
- Protected routes via `ProtectedRoute` component
- Automatic token refresh
- Session storage key: `stepout-auth-token`

### Form Security
- Zod schema validation on all inputs
- File type/size validation before upload
- SQL injection protection via Supabase parameterized queries

---

## Common Tasks

### Adding a New Section
1. Create `src/sections/NewSection.tsx`
2. Follow the section component pattern (use ref + IntersectionObserver)
3. Add route ID for anchor navigation
4. Import and add to `App.tsx` in `MainWebsite` component

### Adding a New shadcn/ui Component
```bash
# If shadcn CLI is available:
npx shadcn add component-name

# Or create manually in src/components/ui/:
# - Follow existing component patterns
# - Use CVA for variants
# - Export from the file
```

### Adding Custom Colors
1. Add to `tailwind.config.js` in `extend.colors` section
2. Use hex, HSL, or RGB values
3. Access via Tailwind classes: `bg-mint`, `text-purple-accent`

### Modifying Navigation
Edit `src/components/Navbar.tsx`:
- Update `navLinks` array for menu items
- Both desktop and mobile menus need updates

### Adding New Form Fields
1. Update `src/types/inschrijving.ts` interface
2. Add validation to `src/lib/validation.ts`
3. Update form in `src/sections/ContactAndSignup.tsx`
4. Update `useFormSubmit.ts` hook to include new field
5. Update Supabase table schema

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component, route definitions |
| `src/main.tsx` | React entry point |
| `src/index.css` | Global styles, CSS variables, custom utilities |
| `tailwind.config.js` | Theme configuration, colors, animations |
| `components.json` | shadcn/ui configuration |
| `vite.config.ts` | Vite plugins, aliases, base path |
| `src/lib/utils.ts` | `cn()` utility for Tailwind class merging |
| `src/lib/supabase.ts` | Supabase client initialization |
| `src/contexts/AuthContext.tsx` | Authentication state management |
| `.env.local` | Environment variables (not committed) |

---

## Troubleshooting

### Build Issues
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check TypeScript strict mode compliance
- Verify all imports use `@/` aliases

### Routing Issues
- Remember: Uses HashRouter, not BrowserRouter
- URLs will have `/#/` prefix (e.g., `/#/admin`)

### Supabase Connection
- Check browser console for connection errors
- Verify CSP allows connections to Supabase domain
- Confirm RLS policies are configured correctly
